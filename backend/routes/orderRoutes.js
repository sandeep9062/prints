// routes/orders.routes.js
import express from "express";
import {
  getOrdersByUser,
  updateOrderStatus,
  getOrderById,
} from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// -------------------------
// PROTECTED ROUTES (Merchant/Admin)
// -------------------------
router.get("/", protect, getOrdersByUser);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, updateOrderStatus);

export default router;
