// routes/products.routes.js
import express from "express";
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
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

// -------------------------
// PUBLIC ROUTES
// -------------------------
router.get("/", getProducts);
router.post("/seed", seedProducts);

// -------------------------
// PROTECTED (Merchant/Admin)
// -------------------------
// Admin listing — includes `inactive` products so hidden ones stay editable.
// Declared before `/:id` so the literal path isn't captured as an id.
router.get("/admin/all", protect, getAllProductsAdmin);
router.get("/user", protect, getProductsByUser); // Must be before /:id
router.post("/", protect, upload.array("image", 12), createProduct);
router.put("/:id", protect, upload.array("image", 12), updateProduct);
// Single-field status write — no multipart/upload middleware needed, which also
// keeps it off the `/:id` PUT above.
router.patch("/:id/status", protect, updateProductStatus);
// Single-field `featured` write — same reasoning as the status route above.
router.patch("/:id/featured", protect, updateProductFeatured);
router.delete("/:id", protect, deleteProduct);
router.delete("/:id/images", protect, deleteProductImage);

// This public route must be last to avoid matching specific routes
router.get("/:id", getProductById);
router.get("/slug/:slug", getProductBySlug);
export default router;
