import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

import dotenv from "dotenv";
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const allowedFormats = ["jpg", "jpeg", "png", "mp4", "mov", "avi"];
    const fileExtension = file.originalname.split(".").pop().toLowerCase();

    if (!allowedFormats.includes(fileExtension)) {
      throw new Error("Unsupported file type.");
    }

    const isVideo = ["mp4", "mov", "avi"].includes(fileExtension);

    return {
      folder: "RealEstate",
      resource_type: isVideo ? "video" : "image",
      format: fileExtension,
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

// Multer Upload Middleware
const upload = multer({
  /*
   * In tests, skip the real Cloudinary round-trip and use in-memory storage
   * instead. The integration tests exercise route guards and controllers, not
   * Cloudinary itself, and a dummy API key would otherwise make every upload
   * route fail with "Invalid api_key".
   */
  ...(process.env.NODE_ENV === "test"
    ? { storage: multer.memoryStorage() }
    : { storage }),
  limits: { fileSize: 60 * 1024 * 1024 }, // 60MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images and videos are allowed."));
    }
  },
});

export default upload;
