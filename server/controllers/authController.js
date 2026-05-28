import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import crypto from "crypto";
import axios from "axios";

import generateToken from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client("YOUR_GOOGLE_CLIENT_ID");

// ==================
// NORMAL SIGNUP
// ==================
export const registerUser = async (req, res) => {
  try {
    console.log("📝 Register request body:", JSON.stringify(req.body, null, 2));

    const { name, email, phone, password, role } = req.body;

    // Basic validation
    if (!name || !email || !phone || !password) {
      console.log("❌ Validation failed - missing fields:", {
        name: !!name,
        email: !!email,
        phone: !!phone,
        password: !!password,
      });
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    console.log("🔍 Checking for existing user with email:", email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("🔍 Checking for existing user with phone:", phone);
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      console.log("❌ Phone already registered:", phone);
      return res
        .status(400)
        .json({ message: "A user with this phone number already exists" });
    }

    console.log("👤 Creating new user:", {
      name,
      email,
      phone,
      role: role || "client",
    });
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || "client",
    });

    console.log("✅ User created successfully:", {
      _id: user._id,
      name: user.name,
      email: user.email,
    });

    const token = generateToken(user);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        image: user.image,
        wishlist: user.wishlist || [],
        addresses: user.addresses || [],
      },
      token,
      message: "user Registered Succesfully",
    });
  } catch (error) {
    console.error("🔥 Register error:", error.message);
    console.error("🔥 Register error stack:", error.stack);

    // Handle MongoDB duplicate key error (code 11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      const message = `A user with this ${field} already exists`;
      console.log("❌ Duplicate key error on field:", field);
      return res.status(400).json({ message });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==================
// NORMAL LOGIN
// ==================
export const loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    console.log(req.body, "login-data");
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    })
      .select("+password")
      .populate("wishlist")
      .populate("addresses");

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    const { _id, name, email, role, phone, wishlist, addresses, image } = user;
    res.status(200).json({
      user: {
        _id,
        name,
        email,
        role,
        phone,
        wishlist,
        addresses,
        image,
      },
      token,
      role: user.role,
      message: "User Logged in succesfully",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ==================
// GOOGLE LOGIN/SIGNUP
// ==================
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "YOUR_GOOGLE_CLIENT_ID",
    });

    const payload = ticket.getPayload();

    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (user) {
      // If user exists, generate token and send back
      const jwtToken = generateToken(user);
      const {
        _id,
        name: userName,
        role,
        phone,
        wishlist,
        addresses,
        image,
      } = user;
      return res.status(200).json({
        user: {
          _id,
          name: userName,
          email: user.email,
          role,
          phone,
          wishlist: wishlist || [],
          addresses: addresses || [],
          image,
        },
        token: jwtToken,
      });
    }

    // If new user, create account
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    // A placeholder phone is used as it's a required field.
    // The user should be prompted to update it later.
    const tempPhone = Date.now();
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: tempPhone,
      role: "client", // default role; can update later
      image: picture,
    });

    const jwtToken = generateToken(user);
    const {
      _id,
      name: newUserName,
      role,
      phone,
      wishlist,
      addresses,
      image,
    } = user;
    res.status(200).json({
      user: {
        _id,
        name: newUserName,
        email: user.email,
        role,
        phone,
        wishlist: wishlist || [],
        addresses: addresses || [],
        image,
      },
      token: jwtToken,
    });
  } catch (error) {
    console.error("Google authentication error:", error);
    res.status(500).json({ message: "Google authentication failed", error });
  }
};

// ============================
// FORGOT PASSWORD
// ============================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found with this email" });

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save hashed token to DB
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min expiry
    await user.save();

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending reset email", error });
  }
};

// ===========================
// RESET PASSWORD
// ===========================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    // Update password & clear token fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password", error });
  }
};

// ==================
// LOGOUT USER
// ==================
export const logoutUser = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};
