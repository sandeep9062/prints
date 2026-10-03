import express from "express";
import {
  subscribeNewsletter,
  getSubscribers,
} from "../controllers/newsletterController.js";
import { checkAdmin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public: subscribe an email to the newsletter
router.post("/", subscribeNewsletter);

// Admin: list all subscribers
router.get("/", protect, checkAdmin, getSubscribers);

export default router;