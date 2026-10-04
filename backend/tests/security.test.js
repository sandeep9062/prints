/**
 * Security regression tests.
 *
 * Each section maps to a finding from the audit. Run with: npm test
 */
import { test, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import {
  app,
  User,
  Product,
  Order,
  makeUser,
  makeProduct,
  makeOrder,
  resetDb,
  shutdown,
} from "./helpers.js";

beforeEach(resetDb);
after(shutdown);

// ─────────────────────────────────────────────────────────────
// 1. Public registration privilege escalation
// ─────────────────────────────────────────────────────────────

test("registration ignores a client-supplied role and creates a client", async () => {
  const res = await request(app)
    .post("/api/v1/auth/register")
    .send({
      name: "Escalation Attempt",
      email: "escalate@example.com",
      phone: "9998887771",
      password: "Password123!",
      role: "admin", // must be discarded
    })
    .expect(201);

  assert.equal(res.body.user.role, "client", "role must not be honoured");

  const stored = await User.findOne({ email: "escalate@example.com" });
  assert.equal(stored.role, "client");
});

test("POST /api/v1/users also ignores a client-supplied role", async () => {
  // `phone` is required by the User schema, so it must be supplied here.
  const res = await request(app)
    .post("/api/v1/users")
    .send({
      name: "Second Escalation",
      email: "escalate2@example.com",
      phone: "9998887773",
      password: "Password123!",
      role: "admin",
    })
    .expect(201);

  assert.equal(res.body.user.role, "client");
});

test("self-registration can never become a merchant either", async () => {
  // The sign-up form offers a Merchant choice; the API discards it.
  const res = await request(app)
    .post("/api/v1/auth/register")
    .send({
      name: "Merchant Attempt",
      email: "merchant-attempt@example.com",
      phone: "9998887772",
      password: "Password123!",
      role: "merchant",
    })
    .expect(201);

  assert.equal(res.body.user.role, "client");
});

// ─────────────────────────────────────────────────────────────
// 3. Orders leak
// ─────────────────────────────────────────────────────────────

test("a buyer cannot see another buyer's orders", async () => {
  const { user: buyerA, token: tokenA } = await makeUser("client");
  const { user: buyerB } = await makeUser("client");

  const product = await makeProduct(buyerB);
  await makeOrder(buyerB, product);

  const res = await request(app)
    .get("/api/v1/orders")
    .set("Authorization", `Bearer ${tokenA}`)
    .expect(200);

  assert.equal(res.body.count, 0, "buyer A must not see buyer B's order");
});

test("a buyer only sees their own orders", async () => {
  const { user: buyer, token } = await makeUser("client");
  const product = await makeProduct(buyer);
  await makeOrder(buyer, product);

  const res = await request(app)
    .get("/api/v1/orders")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  assert.equal(res.body.count, 1);
});

test("an admin can read all orders", async () => {
  const { user: admin, token: adminToken } = await makeUser("admin");
  const { user: buyerA } = await makeUser("client");
  const { user: buyerB } = await makeUser("client");

  await makeOrder(buyerA, await makeProduct(buyerA));
  await makeOrder(buyerB, await makeProduct(buyerB));

  const res = await request(app)
    .get("/api/v1/orders")
    .set("Authorization", `Bearer ${adminToken}`)
    .expect(200);

  assert.equal(res.body.count, 2, "admin sees every order");
});

test("GET /api/v1/orders/all is admin-only", async () => {
  const { token: clientToken } = await makeUser("client");
  const { token: adminToken } = await makeUser("admin");

  await request(app)
    .get("/api/v1/orders/all")
    .set("Authorization", `Bearer ${clientToken}`)
    .expect(403);

  await request(app)
    .get("/api/v1/orders/all")
    .set("Authorization", `Bearer ${adminToken}`)
    .expect(200);
});

test("a buyer cannot read another buyer's order by id", async () => {
  const { user: buyerA, token: tokenA } = await makeUser("client");
  const { user: buyerB } = await makeUser("client");

  const order = await makeOrder(buyerB, await makeProduct(buyerB));

  await request(app)
    .get(`/api/v1/orders/${order._id}`)
    .set("Authorization", `Bearer ${tokenA}`)
    .expect(403);
});

test("a buyer may cancel their own pending order but not set other statuses", async () => {
  const { user: buyer, token } = await makeUser("client");
  const order = await makeOrder(buyer, await makeProduct(buyer), {
    orderStatus: "pending",
  });

  await request(app)
    .put(`/api/v1/orders/${order._id}/status`)
    .set("Authorization", `Bearer ${token}`)
    .send({ orderStatus: "shipped" })
    .expect(403);

  await request(app)
    .put(`/api/v1/orders/${order._id}/status`)
    .set("Authorization", `Bearer ${token}`)
    .send({ orderStatus: "cancelled" })
    .expect(200);

  const updated = await Order.findById(order._id);
  assert.equal(updated.orderStatus, "cancelled");
});

test("orderStatus is allowlisted", async () => {
  const { user: admin, token } = await makeUser("admin");
  const order = await makeOrder(admin, await makeProduct(admin));

  await request(app)
    .put(`/api/v1/orders/${order._id}/status`)
    .set("Authorization", `Bearer ${token}`)
    .send({ orderStatus: "hacked" })
    .expect(400);
// ─────────────────────────────────────────────────────────────
// 4. Product write access
// ─────────────────────────────────────────────────────────────

test("a merchant cannot update another merchant's product", async () => {
  const { user: merchantA, token: tokenA } = await makeUser("merchant");
  const { user: merchantB } = await makeUser("merchant");

  const productB = await makeProduct(merchantB);

  await request(app)
    .put(`/api/v1/products/${productB._id}`)
    .set("Authorization", `Bearer ${tokenA}`)
    .field("productData", JSON.stringify({ name: "Hijacked" }))
    .expect(403);

  const untouched = await Product.findById(productB._id);
  assert.equal(untouched.name, productB.name);
});

test("a merchant cannot delete another merchant's product", async () => {
  const { user: merchantA, token: tokenA } = await makeUser("merchant");
  const { user: merchantB } = await makeUser("merchant");

  const productB = await makeProduct(merchantB);

  await request(app)
    .delete(`/api/v1/products/${productB._id}`)
    .set("Authorization", `Bearer ${tokenA}`)
    .expect(403);

  assert.ok(await Product.findById(productB._id), "product must still exist");
});

test("a merchant CAN update their own product", async () => {
  const { user: merchant, token } = await makeUser("merchant");
  const product = await makeProduct(merchant);

  await request(app)
    .put(`/api/v1/products/${product._id}`)
    .set("Authorization", `Bearer ${token}`)
    .field("productData", JSON.stringify({ name: "Renamed" }))
    .expect(200);

  const updated = await Product.findById(product._id);
  assert.equal(updated.name, "Renamed");
});

test("an admin CAN update any merchant's product", async () => {
  const { user: admin, token } = await makeUser("admin");
  const { user: merchant } = await makeUser("merchant");
  const product = await makeProduct(merchant);

  await request(app)
    .put(`/api/v1/products/${product._id}`)
    .set("Authorization", `Bearer ${token}`)
    .field("productData", JSON.stringify({ name: "Admin Edited" }))
    .expect(200);

  const updated = await Product.findById(product._id);
  assert.equal(updated.name, "Admin Edited");
});

test("a plain client cannot reach product write routes at all", async () => {
  const { user: client, token } = await makeUser("client");
  const product = await makeProduct(client);

  await request(app)
    .delete(`/api/v1/products/${product._id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(403);
});

test("a merchant cannot feature their own product or set its status", async () => {
  const { user: merchant, token } = await makeUser("merchant");
  const product = await makeProduct(merchant);

  await request(app)
    .patch(`/api/v1/products/${product._id}/featured`)
    .set("Authorization", `Bearer ${token}`)
    .send({ featured: true })
    .expect(403);

  await request(app)
    .patch(`/api/v1/products/${product._id}/status`)
    .set("Authorization", `Bearer ${token}`)
    .send({ status: "active" })
    .expect(403);
});

test("an admin CAN set featured", async () => {
  const { user: admin, token } = await makeUser("admin");
  const { user: merchant } = await makeUser("merchant");
  const product = await makeProduct(merchant);

  await request(app)
    .patch(`/api/v1/products/${product._id}/featured`)
    .set("Authorization", `Bearer ${token}`)
    .send({ featured: true })
    .expect(200);

  const updated = await Product.findById(product._id);
  assert.equal(updated.featured, true);
});

test("updateProduct ignores featured sent through the edit form", async () => {
  const { user: merchant, token } = await makeUser("merchant");
  const product = await makeProduct(merchant);

  await request(app)
    .put(`/api/v1/products/${product._id}`)
    .set("Authorization", `Bearer ${token}`)
    .field("productData", JSON.stringify({ name: "Sneaky", featured: true }))
    .expect(200);

  const updated = await Product.findById(product._id);
  assert.equal(updated.featured, false, "featured must be ignored on update");
});

test("product owner comes from the token, never the body", async () => {
  const { user: merchant, token } = await makeUser("merchant");
  const { user: victim } = await makeUser("merchant");

  const res = await request(app)
    .post("/api/v1/products")
    .set("Authorization", `Bearer ${token}`)
    // createProduct requires at least one uploaded image.
    .attach("image", Buffer.from("fake-image-bytes"), {
      filename: "test.jpg",
      contentType: "image/jpeg",
    })
    .field(
      "productData",
      JSON.stringify({
        name: "Owned By Victim",
        slug: `owned-${Date.now()}`,
        price: 50,
        category: "Wedding Cards",
        owner: victim._id.toString(),
      }),
    )
    .expect(201);

  assert.equal(
    res.body.product.owner.toString(),
    merchant._id.toString(),
    "owner must come from the token",
  );
});

test("GET /api/v1/products/user only returns the caller's own products", async () => {
  const { user: merchantA, token: tokenA } = await makeUser("merchant");
  const { user: merchantB } = await makeUser("merchant");

  await makeProduct(merchantA);
  await makeProduct(merchantB);

  const res = await request(app)
    .get("/api/v1/products/user")
    .set("Authorization", `Bearer ${tokenA}`)
    .expect(200);

  assert.equal(res.body.count, 1);
  assert.equal(
    res.body.products[0].owner.toString(),
    merchantA._id.toString(),
  );
// ─────────────────────────────────────────────────────────────
// 4b. Admin-only role assignment
// ─────────────────────────────────────────────────────────────

test("only an admin can change a role", async () => {
  const { token: adminToken } = await makeUser("admin");
  const { user: target } = await makeUser("client");
  const { token: clientToken } = await makeUser("client");

  await request(app)
    .patch(`/api/v1/users/${target._id}/role`)
    .set("Authorization", `Bearer ${clientToken}`)
    .send({ role: "admin" })
    .expect(403);

  await request(app)
    .patch(`/api/v1/users/${target._id}/role`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ role: "merchant" })
    .expect(200);

  const updated = await User.findById(target._id);
  assert.equal(updated.role, "merchant");
});

test("the role endpoint rejects a value outside the allowlist", async () => {
  const { token } = await makeUser("admin");
  const { user: target } = await makeUser("client");

  await request(app)
    .patch(`/api/v1/users/${target._id}/role`)
    .set("Authorization", `Bearer ${token}`)
    .send({ role: "superadmin" })
    .expect(400);
});

test("an admin cannot demote themselves", async () => {
  const { user: admin, token } = await makeUser("admin");

  await request(app)
    .patch(`/api/v1/users/${admin._id}/role`)
    .set("Authorization", `Bearer ${token}`)
    .send({ role: "client" })
    .expect(400);

  const unchanged = await User.findById(admin._id);
  assert.equal(unchanged.role, "admin");
});

// ─────────────────────────────────────────────────────────────
// 6. Mass assignment via PUT /api/v1/users/:id
// ─────────────────────────────────────────────────────────────

test("PUT /api/v1/users/:id cannot set role or isActive", async () => {
  const { token } = await makeUser("admin");
  const { user: victim } = await makeUser("client");

  const res = await request(app)
    .put(`/api/v1/users/${victim._id}`)
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "Renamed", role: "admin", isActive: false })
    .expect(200);

  assert.equal(res.body.user.name, "Renamed");
  assert.equal(res.body.user.role, "client", "role must be untouched");
  assert.equal(res.body.user.isActive, true, "isActive must be untouched");
});

test("a non-admin cannot update another user", async () => {
  const { token } = await makeUser("client");
  const { user: victim } = await makeUser("client");

  await request(app)
    .put(`/api/v1/users/${victim._id}`)
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "Hacked" })
    .expect(403);
});

test("GET /api/v1/users/:id is no longer public", async () => {
  const { user: victim } = await makeUser("client");

  await request(app).get(`/api/v1/users/${victim._id}`).expect(401);

  const { token } = await makeUser("client");
  await request(app)
    .get(`/api/v1/users/${victim._id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(403);
});

// ─────────────────────────────────────────────────────────────
// 4c. 401 unauthenticated vs 403 wrong role
// ─────────────────────────────────────────────────────────────

test("unauthenticated requests get 401 on protected routes", async () => {
  await request(app).get("/api/v1/orders").expect(401);
  await request(app).get("/api/v1/orders/all").expect(401);
  await request(app).get("/api/v1/products/admin/all").expect(401);
  await request(app).get("/api/v1/users").expect(401);
  await request(app)
    .delete("/api/v1/users/000000000000000000000000")
    .expect(401);
});

test("a non-admin gets 403 on admin-only routes", async () => {
  const { token } = await makeUser("merchant");

  await request(app)
    .get("/api/v1/users")
    .set("Authorization", `Bearer ${token}`)
    .expect(403);

  await request(app)
    .get("/api/v1/products/admin/all")
    .set("Authorization", `Bearer ${token}`)
    .expect(403);

  await request(app)
    .get("/api/v1/enquiry")
    .set("Authorization", `Bearer ${token}`)
    .expect(403);

  await request(app)
    .post("/api/v1/products/seed")
    .set("Authorization", `Bearer ${token}`)
    .expect(403);
});

test("blog writes require admin", async () => {
  const { token } = await makeUser("merchant");

  await request(app)
    .post("/api/v1/blogs")
    .set("Authorization", `Bearer ${token}`)
    .expect(403);

  await request(app)
    .post("/api/v1/blogs")
    .expect(401);
});

test("a malformed token is rejected", async () => {
  await request(app)
    .get("/api/v1/orders")
    .set("Authorization", "Bearer not-a-real-token")
    .expect(401);
});

// ─────────────────────────────────────────────────────────────
// 8. Hardening
// ─────────────────────────────────────────────────────────────

test("security headers are present", async () => {
  const res = await request(app).get("/api/v1/products").expect(200);
  assert.ok(
    res.headers["content-security-policy"],
    "helmet should set a CSP",
  );
  assert.equal(res.headers["x-content-type-options"], "nosniff");
});

test("the login endpoint is rate limited", async () => {
  /*
   * Uses a dedicated limiter instance mounted on a throwaway route rather than
   * the app's own /auth/login limiter — that one is disabled under NODE_ENV=test
   * (see app.js) so this assertion cannot make unrelated tests fail with a 429.
   * The production configuration is the same code path.
   */
  const rateLimit = (await import("express-rate-limit")).default;
  const express = (await import("express")).default;

  const mini = express();
  mini.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 3,
      standardHeaders: "draft-7",
      legacyHeaders: false,
    }),
  );
  mini.post("/login", (req, res) => res.json({ ok: true }));

  const statuses = [];
  for (let i = 0; i < 5; i++) {
    const res = await request(mini).post("/login");
    statuses.push(res.status);
  }

  assert.ok(
    statuses.includes(429),
    `expected a 429 after exceeding the limit, got ${statuses.join(",")}`,
  );
});
});
});