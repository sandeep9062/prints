import mongoose, { Schema, Document } from "mongoose";

const ReviewSchema =
  new Schema() 
  ({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    product: { type: Schema.Types.ObjectId, ref: "Product" },

    rating: { type: Number, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: true });

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
