"use client";

/*
 * Merchant "add product".
 *
 * Deliberately a thin wrapper around the admin ProductForm rather than a
 * second implementation: the merchant area had its own multi-step form,
 * which meant the category / color / paper-type options had to be kept in
 * sync in two places. ProductForm is now shared, with these props adapting
 * it to each dashboard:
 *
 *  - redirectPath : back to the merchant catalogue, not the admin one
 *  - showFeatured : hidden — featuring is an admin merchandising decision
 *                   (see the `featured` notes in productController.js)
 *  - showHeading  : the merchant shell already renders a page title
 *
 * Field layout and validation live in
 * components/admin-dashbaord/ProductForm.tsx.
 */
import ProductForm from "@/components/admin-dashbaord/ProductForm";

export default function AddProductPage() {
  return (
    <ProductForm
      mode="add"
      redirectPath="/merchant-dashboard/products"
      showFeatured={false}
      showHeading={false}
      subtitle="Fill in the details to publish a new product to your store"
    />
  );
}
