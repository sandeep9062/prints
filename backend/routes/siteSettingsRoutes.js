import express from "express";
import {
  getSiteSettings,
  createSiteSettings,
  updateSiteSettings,
  deleteSiteSettings,
} from "../controllers/siteSettingsController.js";
import { checkAdmin, protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// Multer fields config for optional file uploads
const brandingUpload = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "banner", maxCount: 1 },
  { name: "favicon", maxCount: 1 },
]);

// Conditional multer: only parse multipart if Content-Type is multipart/form-data
const conditionalBrandingUpload = (req, res, next) => {
  const contentType = req.headers["content-type"] || "";
  if (contentType.includes("multipart/form-data")) {
    brandingUpload(req, res, next);
  } else {
    next();
  }
};

// Single-document CRUD
router.get("/", getSiteSettings);
router.post(
  "/",
  protect,
  checkAdmin,
  conditionalBrandingUpload,
  createSiteSettings,
);
router.put(
  "/:id",
  protect,
  checkAdmin,
  conditionalBrandingUpload,
  updateSiteSettings,
);
router.delete("/:id", protect, checkAdmin, deleteSiteSettings);

export default router;
