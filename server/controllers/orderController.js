// controllers/orders.controller.js
import Order from "../models/Order.js";
import User from "../models/User.js";
import Address from "../models/Address.js";

// =====================================
// GET ORDERS BY USER (Merchant/Admin)
// =====================================
export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("address")
      .populate("items.product", "name images price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get Orders by User Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// UPDATE ORDER STATUS
// =====================================
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true, runValidators: true }
    ).populate("user", "name email phone")
     .populate("address")
     .populate("items.product", "name images price");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// GET ORDER BY ID
// =====================================
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("address")
      .populate("items.product", "name images price");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Get Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
