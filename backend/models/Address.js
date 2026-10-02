import mongoose, { Schema} from "mongoose";

const AddressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },

    fullName: { type: String, required: true },
    phone: { type: String, required: true },

    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
  },
  { timestamps: true }
);

export default mongoose.models.Address ||
  mongoose.model("Address", AddressSchema);
