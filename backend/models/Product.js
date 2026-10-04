import mongoose, { Schema, Document } from "mongoose";
import { CustomizationSchema } from "./Customization.js";

const ProductSchema = new Schema(
  {
    // productCode:{ type: String, required: true, unique: true },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    badge: { type: String },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    images: [{ type: String }],
    category: { type: String, required: true },
    stock: { type: Number, default: 50 },
    // Defaults keep the API from returning `dimensions: undefined` for
    // documents created before this field existed.
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
    options: {
      sizes: [String],
      paperTypes: [String],
      colors: [String],
    },
    featured: { type: Boolean, default: false },
    // Admin-managed publish toggle. Defaults to "active" so every document
    // created before this field existed keeps showing in the storefront
    // (`{ status: { $ne: "inactive" } }` also matches missing fields).
    // Distinct from `stock`: a product can be in stock but hidden.
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
