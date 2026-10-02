import mongoose, { Schema, Document } from "mongoose";
import { CustomizationSchema } from "./Customization.js";

const CartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },

    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
        customization: CustomizationSchema,
      },
    ],
  },
  { timestamps: true });

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
