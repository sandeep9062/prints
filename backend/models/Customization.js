import mongoose, { Schema } from "mongoose";

export const CustomizationSchema = new Schema(
  {
    groomName: { type: String, required: true },
    brideName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    venue: { type: String, required: true },
    message: { type: String, default: "" },
    selectedFont: { type: String, required: true },
    selectedColor: {
      name: { type: String, required: true },
      primary: { type: String, required: true },
      secondary: { type: String, required: true },
    },
    selectedBorder: {
      name: { type: String, required: true },
      pattern: { type: String, required: true },
    },
    selectedTemplate: {
      name: { type: String, required: true },
      preview: { type: String, required: true },
      ornaments: [{ type: String }],
    },
    uploadedImages: [{ type: String }],
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

// Index for user-based queries
CustomizationSchema.index({ user: 1, createdAt: -1 });

const Customization = mongoose.model("Customization", CustomizationSchema);

export default Customization;
