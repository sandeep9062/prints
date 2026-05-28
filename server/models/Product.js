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
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    options: {
      sizes: [String],
      paperTypes: [String],
      colors: [String],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
