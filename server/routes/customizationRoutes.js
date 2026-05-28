import express from "express";
import {
  createCustomization,
  uploadCustomizationImages,
  getAllCustomizations,
  getMyCustomizations,
  getCustomizationById,
  deleteCustomization,
} from "../controllers/customizationController.js";
import { protect, checkAdmin } from "../middlewares/authMiddleware.js";
import { optionalAuth } from "../middlewares/optionalAuth.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// Public - anyone can submit a customization (optionally attach user if logged in)
router.post("/", optionalAuth, createCustomization);
// Upload images for customization
router.post(
  "/upload",
  optionalAuth,
  upload.array("images", 5),
  uploadCustomizationImages,
);
// Admin only - get all customizations
router.get("/", protect, checkAdmin, getAllCustomizations);
// Protected - get logged-in user's customizations (must be before /:id)
router.get("/my", protect, getMyCustomizations);
// Protected - get single customization
router.get("/:id", protect, getCustomizationById);
// Protected - delete customization (owner or admin)
router.delete("/:id", protect, deleteCustomization);

export default router;
