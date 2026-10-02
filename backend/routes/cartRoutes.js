import express from "express";
import {
  addItemToCart,
  getUserCart,
  removeItemFromCart,
  updateCartItemQuantity,
  clearUserCart,
} from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, addItemToCart).get(protect, getUserCart).delete(protect, clearUserCart);
router.route("/:id").delete(protect, removeItemFromCart).put(protect, updateCartItemQuantity);

export default router;
