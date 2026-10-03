import mongoose, { Schema } from "mongoose";

const NewsletterSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Newsletter ||
  mongoose.model("Newsletter", NewsletterSchema);
