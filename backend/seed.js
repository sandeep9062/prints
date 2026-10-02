import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import { products } from "./data/product.ts";

const seedProducts = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});
    console.log("🧹 Cleared existing products");

    // Insert all products
    const seeded = await Product.insertMany(products);
    console.log(`✅ Successfully seeded ${seeded.length} products:`);
    seeded.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name} (₹${p.price})`);
    });

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedProducts();
