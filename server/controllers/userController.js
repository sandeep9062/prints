// controllers/users.controller.js
import User from "../models/User.js";
import Order from "../models/Order.js";
import Wishlist from "../models/Wishlist.js";

// =====================================
// GET ALL CUSTOMERS (Clients)
// =====================================
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "client" })
      .select("name email phone createdAt isActive image")
      .sort({ createdAt: -1 });

    // Add order statistics for each customer
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const orderStats = await Order.aggregate([
          { $match: { user: customer._id } },
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalSpent: { $sum: "$totalAmount" },
              lastOrderDate: { $max: "$createdAt" }
            }
          }
        ]);

        const stats = orderStats[0] || {
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: null
        };

        return {
          ...customer.toObject(),
          orderStats: {
            totalOrders: stats.totalOrders,
            totalSpent: stats.totalSpent,
            lastOrderDate: stats.lastOrderDate
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      count: customersWithStats.length,
      customers: customersWithStats,
    });
  } catch (error) {
    console.error("Get All Customers Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// GET CUSTOMER BY ID WITH DETAILS
// =====================================
export const getCustomerById = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id)
      .select("-password")
      .populate("addresses", "street city state zipCode isDefault")
      .populate("products", "name images price");

    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    // Get customer's orders with product details
    const customerOrders = await Order.find({ user: customer._id })
      .populate("items.product", "name images price")
      .populate("address")
      .sort({ createdAt: -1 })
      .limit(10); // Last 10 orders

    // Calculate customer statistics
    const stats = await Order.aggregate([
      { $match: { user: customer._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
          avgOrderValue: { $avg: "$totalAmount" },
          firstOrderDate: { $min: "$createdAt" },
          lastOrderDate: { $max: "$createdAt" }
        }
      }
    ]);

    const customerStats = stats[0] || {
      totalOrders: 0,
      totalSpent: 0,
      avgOrderValue: 0,
      firstOrderDate: null,
      lastOrderDate: null
    };

    res.status(200).json({
      success: true,
      customer: {
        ...customer.toObject(),
        recentOrders: customerOrders,
        stats: customerStats
      }
    });
  } catch (error) {
    console.error("Get Customer Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// GET USER PROFILE
// =====================================
export const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get User Profile Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// UPDATE USER PROFILE
// =====================================
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const updateData = { name, email, phone };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// GET USER FAVOURITES
// =====================================
export const userFavourites = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      "products",
      "name images price discountPrice badge category"
    );

    const favourites = wishlist ? wishlist.products : [];
    res.status(200).json({ success: true, favourites });
  } catch (error) {
    console.error("Get User Favourites Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// TOGGLE FAVOURITE
// =====================================
export const toggleFavourite = async (req, res) => {
  try {
    const { propId } = req.params; // Note: called propId but it's productId
    const userId = req.user._id;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [propId] });
    } else {
      const productIndex = wishlist.products.indexOf(propId);

      if (productIndex > -1) {
        // Remove from favourites
        wishlist.products.splice(productIndex, 1);
      } else {
        // Add to favourites
        wishlist.products.push(propId);
      }

      await wishlist.save();
    }

    res.status(200).json({
      success: true,
      message: "Favourite updated successfully",
      wishlist: wishlist.products,
    });
  } catch (error) {
    console.error("Toggle Favourite Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// GET USER BY ID
// =====================================
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// CREATE USER
// =====================================
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = await User.create({ name, email, password, role: role || "client" });
    res.status(201).json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// GET ALL USERS
// =====================================
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// UPDATE USER
// =====================================
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isActive },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// DELETE USER
// =====================================
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// BOOK VISIT (Not applicable for this app - placeholder)
// =====================================
export const bookVisit = async (req, res) => {
  return res.status(400).json({
    success: false,
    message: "Booking visits is not applicable for this application"
  });
};

// =====================================
// CANCEL VISIT (Not applicable for this app - placeholder)
// =====================================
export const cancelVisit = async (req, res) => {
  return res.status(400).json({
    success: false,
    message: "Cancelling visits is not applicable for this application"
  });
};
