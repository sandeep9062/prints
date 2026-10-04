// controllers/orders.controller.js
import Order from "../models/Order.js";
import User from "../models/User.js";
import Address from "../models/Address.js";
import Product from "../models/Product.js";

/*
 * Field lists used on every order response, so the shape of the payload is
 * intentional rather than dumping whole related documents.
 *
 * These are the SELECTION lists; the paths are applied by `applyPopulates`
 * below. (Mongoose's `.populate()` takes the path and the selection as two
 * separate arguments — combining them into one string does NOT work and throws
 * "Cannot populate path `name` because it is not in your schema".)
 */
const USER_FIELDS = "name email phone";
const PRODUCT_FIELDS = "name images price";

/** Applies the standard order populates to a query. */
function applyPopulates(query) {
  return query
    .populate("user", USER_FIELDS)
    .populate("address")
    .populate("items.product", PRODUCT_FIELDS);
}

/**
 * Decides whether `user` may see/modify `order`.
 *
 * Rules, in order:
 *   1. admin                -> anything
 *   2. the order's buyer     -> their own order
 *   3. a merchant selling a
 *      product in the order -> only if at least one line item is owned by them
 *
 * Returns true when access is allowed.
 */
async function canAccessOrder(order, user) {
  if (!user) return false;
  if (user.role === "admin") return true;

  // The buyer's own order.
  if (order.user && String(order.user) === String(user._id)) return true;

  // A merchant may see orders containing one of their products. Products in an
  // order are referenced by id, so this needs a lookup rather than a plain
  // field comparison.
  if (user.role === "merchant") {
    const productIds = (order.items || [])
      .map((item) => item?.product?._id ?? item?.product)
      .filter(Boolean)
      .map(String);

    if (productIds.length === 0) return false;

    const ownedCount = await Product.countDocuments({
      _id: { $in: productIds },
      owner: user._id,
    });
    return ownedCount > 0;
  }

  return false;
}

// =====================================
// GET MY ORDERS (buyer-scoped)
// =====================================
/*
 * SECURITY: this used to be `Order.find()` with no filter, so ANY logged-in
 * account received every order on the platform together with the buyer's
 * name, email, phone and address. It is now scoped to the caller.
 */
export const getOrdersByUser = async (req, res) => {
  try {
    /*
     * Role-aware scoping.
     *
     *   buyer    -> only orders they placed
     *   merchant -> orders containing at least one of their products
     *   admin    -> everything (the admin dashboard also has GET /all, but
     *               keeping admin here means the existing frontend query works)
     *
     * The previous implementation ignored `req.user` completely and returned
     * every order on the platform.
     */
    const user = req.user;
    let filter;

    if (user.role === "admin") {
      filter = {};
    } else if (user.role === "merchant") {
      const ownedProductIds = await Product.find({ owner: user._id })
        .select("_id")
        .lean();
      filter = { "items.product": { $in: ownedProductIds.map((p) => p._id) } };
    } else {
      filter = { user: user._id };
    }

    const orders = await applyPopulates(
      Order.find(filter).sort({ createdAt: -1 }),
    );

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get Orders by User Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// GET ALL ORDERS (admin dashboard)
// =====================================
/*
 * Admin-only counterpart to getOrdersByUser, used by the admin dashboard's
 * order list and analytics. Guarded by protect + checkAdmin in orderRoutes.
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await applyPopulates(
      Order.find().sort({ createdAt: -1 }),
    );

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error.message);
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

    // Allowlist the status rather than writing the client's string straight
    // through, so the value is always one the schema intends.
    const ALLOWED_STATUSES = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!ALLOWED_STATUSES.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid orderStatus. Must be one of: ${ALLOWED_STATUSES.join(", ")}.`,
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const isBuyer = String(order.user) === String(req.user._id);
    const isPrivileged =
      req.user.role === "admin" || req.user.role === "merchant";

    // A buyer may only cancel, and only while the order is still pending.
    if (isBuyer && !isPrivileged) {
      if (orderStatus !== "cancelled") {
        return res.status(403).json({
          success: false,
          message: "You can only cancel your own order.",
        });
      }
      if (order.orderStatus !== "pending") {
        return res.status(403).json({
          success: false,
          message: "This order can no longer be cancelled.",
        });
      }
    } else if (!isBuyer) {
      const allowed = await canAccessOrder(order, req.user);
      if (!allowed) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You do not own this order.",
        });
      }
    }

    order.orderStatus = orderStatus;
    await order.save();

    const populated = await applyPopulates(Order.findById(order._id));

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: populated,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// GET ORDER BY ID
// =====================================
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Previously any logged-in user could read any order by id, exposing the
    // buyer's contact details and delivery address.
    const allowed = await canAccessOrder(order, req.user);
    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not own this order.",
      });
    }

    applyPopulates(order);

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Get Order Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin-only hard delete, backing the admin dashboard's order list.
 *
 * A customer-facing "cancel" is a status change (see updateOrderStatus) so the
 * record is retained for reporting; this is a genuine delete and is mounted
 * behind protect + checkAdmin.
 */
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete Order Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
