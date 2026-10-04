// routes/products.routes.js
import express from "express";
import Product from "../models/Product.js";
import {
  createProduct,
  getProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  getProductsByUser,
  getAllProductsAdmin,
  updateProductStatus,
  updateProductFeatured,
  seedProducts,
} from "../controllers/productController.js";
import {
  protect,
  checkAdmin,
  authorize,
  isOwnerOrAdmin,
} from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

// -------------------------
// PUBLIC ROUTES
// -------------------------
router.get("/", getProducts);

/*
 * SEEDING IS DESTRUCTIVE AND MUST NOT BE PUBLIC.
 *
 * seedProducts starts with `Product.deleteMany({})`, so leaving this route
 * unauthenticated meant anyone could wipe the entire catalogue by POSTing to
 * /api/v1/products/seed. Now admin-only.
 */
router.post("/seed", protect, checkAdmin, seedProducts);

// -------------------------
// PROTECTED (Merchant/Admin)
// -------------------------
// Admin listing — includes `inactive` products so hidden ones stay editable.
// Declared before `/:id` so the literal path isn't captured as an id.
router.get("/admin/all", protect, checkAdmin, getAllProductsAdmin);
router.get("/user", protect, authorize("merchant", "admin"), getProductsByUser); // Must be before /:id

// owner is always taken from req.user._id, never the body.
router.post(
  "/",
  protect,
  authorize("merchant", "admin"),
  upload.array("image", 12),
  createProduct,
);

/*
 * Ownership gates below.
 *
 * These three handlers used `protect` alone, so ANY logged-in account — not
 * just other merchants — could rewrite or delete any product in the catalogue.
 * `isOwnerOrAdmin` loads the product, 403s unless the caller owns it or is an
 * admin, and attaches it as `req.doc`.
 */
router.put(
  "/:id",
  protect,
  authorize("merchant", "admin"),
  isOwnerOrAdmin(Product),
  upload.array("image", 12),
  updateProduct,
);
router.delete(
  "/:id",
  protect,
  authorize("merchant", "admin"),
  isOwnerOrAdmin(Product),
  deleteProduct,
);
router.delete(
  "/:id/images",
  protect,
  authorize("merchant", "admin"),
  isOwnerOrAdmin(Product),
  deleteProductImage,
);

// Single-field status write — no multipart/upload middleware needed, which also
// keeps it off the `/:id` PUT above. Admin-only: publishing/approving a product
// is not a merchant's decision.
router.patch("/:id/status", protect, checkAdmin, updateProductStatus);
// Single-field `featured` write — same reasoning as the status route above.
router.patch("/:id/featured", protect, checkAdmin, updateProductFeatured);

// This public route must be last to avoid matching specific routes
router.get("/:id", getProductById);
router.get("/slug/:slug", getProductBySlug);
export default router;
