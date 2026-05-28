import mongoose, { Schema } from "mongoose";

const NewsletterSchema = new Schema(
  {
    email: { type: String, unique: true },
  },
  { timestamps: true }
);

export default mongoose.models.Newsletter ||
  mongoose.model("Newsletter", NewsletterSchema);
