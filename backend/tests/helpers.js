/**
 * Shared test bootstrap.
 *
 * Spins up an in-memory MongoDB, imports the real Express app against it and
 * exposes helpers to create users of each role and mint their JWTs.
 *
 * The app is imported for its side effect of registering routes; `app.js`
 * starts a listener on import, so we immediately close that server again and
 * rely on supertest's ephemeral listener for every request.
 */
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Must be set before app.js is imported — app.js refuses to boot without it.
process.env.JWT_SECRET = "test-secret-not-used-anywhere-else";
process.env.NODE_ENV = "test";

const mongod = await MongoMemoryServer.create();
await mongoose.connect(mongod.getUri());

/*
 * Cloudinary is configured at import time by middlewares/multer.js. In tests we
 * point it at placeholder credentials so `upload.array("image", 12)` parses the
 * multipart body and produces a req.files entry WITHOUT performing a real
 * network upload. The resulting `file.path` is whatever Cloudinary's storage
 * object reports; the assertions that matter (guards, owner, featured, status)
 * do not depend on its value.
 *
 * This keeps the production middleware in the loop — the route guards and
 * controllers under test are the real ones.
 */
process.env.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "test-cloud";
process.env.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "test-key";
process.env.CLOUDINARY_API_SECRET =
  process.env.CLOUDINARY_API_SECRET || "test-secret";

const { default: app, server } = await import("../app.js");
if (server) await new Promise((resolve) => server.close(resolve));

/*
 * app.js calls connectDB() in its listen callback, which races the in-memory
 * connection we just opened. That's harmless — mongoose keeps the first
 * connection — so we just log it rather than failing the run.
 */

const User = (await import("../models/User.js")).default;
const Product = (await import("../models/Product.js")).default;
const Order = (await import("../models/Order.js")).default;

export { app, mongoose, User, Product, Order };

/** Creates a user with a given role and returns the record + a signed token. */
export async function makeUser(role = "client", overrides = {}) {
  const suffix = Math.random().toString(36).slice(2, 10);
  const user = await User.create({
    name: overrides.name ?? `Test ${role}`,
    email: overrides.email ?? `${role}-${suffix}@example.com`,
    phone: overrides.phone ?? `9${Math.floor(Math.random() * 1e9)}`,
    password: overrides.password ?? "Password123!",
    providers: ["local"],
    role,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return { user, token };
}

/** Creates a product owned by `owner`. */
export async function makeProduct(owner, overrides = {}) {
  const suffix = Math.random().toString(36).slice(2, 8);
  return Product.create({
    owner: owner._id,
    name: overrides.name ?? `Product ${suffix}`,
    slug: overrides.slug ?? `product-${suffix}`,
    description: "test product",
    price: overrides.price ?? 100,
    category: overrides.category ?? "Wedding Cards",
    stock: 10,
    images: ["https://example.com/a.jpg"],
  });
}

/** Creates an order placed by `buyer` containing `product`. */
export async function makeOrder(buyer, product, overrides = {}) {
  return Order.create({
    user: buyer._id,
    items: [
      {
        product: product._id,
        quantity: 1,
        price: product.price,
      },
    ],
    address: undefined,
    paymentMethod: "COD",
    orderStatus: overrides.orderStatus ?? "pending",
    paymentStatus: "pending",
    // Deliberately set a distinctive amount so tests can detect tampering.
    totalAmount: overrides.totalAmount ?? 999,
  });
}

/** Wipes every collection between tests. */
export async function resetDb() {
  const { collections } = mongoose.connection;
  await Promise.all(
    Object.values(collections).map((c) => c.deleteMany({})),
  );
}

/** Closes the in-memory server at the end of the run. */
export async function shutdown() {
  await mongoose.disconnect();
  await mongod.stop();
}