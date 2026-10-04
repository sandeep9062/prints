import express from "express";
import { createEnquiry, getAllEnquiries } from "../controllers/enquiryController.js";
import { protect, checkAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public: anyone can submit an enquiry (contact form, print enquiry,
// merchant application).
router.post("/", createEnquiry);

/*
 * Reading every enquiry exposes the names, emails and phone numbers of everyone
 * who has contacted the business, so it is admin-only. This was previously a
 * bare public GET.
 */
router.get("/", protect, checkAdmin, getAllEnquiries);

export default router;
