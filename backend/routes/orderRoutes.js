// routes/orders.routes.js
import express from "express";
import {
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  deleteOrder,
} from "../controllers/orderController.js";
import { protect, checkAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/*
 * GUARDS — audit notes
 * -------------------
 * `GET /` was `protect` + `getOrdersByUser`, and that handler returned
 * `Order.find()` unfiltered — every order on the platform, including other
 * buyers' names, emails, phones and addresses, to any logged-in account.
 *
 * The merchant dashboard and the customer's own "My Orders" both call this
 * endpoint, so the behaviour is now role-aware in one handler:
 *   - buyer          -> only their own orders
 *   - merchant/admin -> orders containing their products / all orders
 * The unfiltered read that the admin dashboard needs is `GET /all` (admin only).
 */
router.get("/", protect, getOrdersByUser);

// Admin-wide listing for the admin dashboard.
router.get("/all", protect, checkAdmin, getAllOrders);

router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, updateOrderStatus);

// Admin-only hard delete (the customer path is a cancel = status change).
router.delete("/:id", protect, checkAdmin, deleteOrder);

export default router;
