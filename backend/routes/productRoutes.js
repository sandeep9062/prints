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
router.get("/user", protect, getProductsByUser); // Must be before /:id
router.post("/", protect, upload.array("image", 12), createProduct);
router.put("/:id", protect, upload.array("image", 12), updateProduct);
router.delete("/:id", protect, deleteProduct);
router.delete("/:id/images", protect, deleteProductImage);

// This public route must be last to avoid matching specific routes
router.get("/:id", getProductById);
router.get("/slug/:slug", getProductBySlug);
export default router;
