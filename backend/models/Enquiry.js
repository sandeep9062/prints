import mongoose, { Schema } from "mongoose";

/*
 * Enquiries submitted through the public contact / print-enquiry / merchant
 * application forms.
 *
 * NOTE: this model used to be named `ContactSchema` and registered as
 * "Contact", making it a byte-for-byte duplicate of the (unused)
 * models/Contact.js — both claimed the same model name and collection. That
 * duplicate has been removed and the schema renamed to match what it stores.
 */
const EnquirySchema = new Schema(
  {
    name: String,
    email: String,
    phone: String,
    message: String,
  },
  { timestamps: true }
);

export default mongoose.models.Enquiry ||
  mongoose.model("Enquiry", EnquirySchema);
