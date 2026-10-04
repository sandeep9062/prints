import mongoose, { Schema, Document } from "mongoose";

/**
 * Customization attached to a single cart line.
 *
 * Deliberately NOT the shared CustomizationSchema: that one describes the
 * full wedding-invitation customizer (groomName, brideName, eventDate,
 * venue, selectedFont, selectedColor / selectedBorder / selectedTemplate)
 * and every field on it is `required: true`. Reusing it here meant an
 * ordinary storefront add-to-cart — which only sends size / paperType /
 * colorTheme — failed Mongoose validation on save, so `POST /v1/cart`
 * answered 500 and nothing was ever added. The card quick-add only worked
 * because it posts no customization at all, so no subdocument was created.
 *
 * `_id: false` keeps the generated id out of the subdocument: the dedupe
 * comparison in addItemToCart serialises `customization` to build its key
 * (see controllers/cartController.js).
 *
 * Exported so order creation can reuse this shape at checkout rather than
 * repeat the mismatch — Order.items currently points at the customizer
 * schema and would fail the same way the moment orders are creatable.
 */
export const CartItemCustomizationSchema = new Schema(
  {
    size: { type: String, default: "" },
    paperType: { type: String, default: "" },
    colorTheme: { type: String, default: "" },
  },
  { _id: false },
);

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
        customization: CartItemCustomizationSchema,
      },
    ],
  },
  { timestamps: true });

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
