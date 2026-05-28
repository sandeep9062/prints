import mongoose, { Schema, Document } from "mongoose";
import { CustomizationSchema } from "./Customization.js";

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number,
        customization: CustomizationSchema,
      },
    ],

    address: { type: Schema.Types.ObjectId, ref: "Address" },

    paymentMethod: { type: String, enum: ["COD", "Razorpay", "UPI"] },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
