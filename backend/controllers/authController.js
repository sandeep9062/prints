import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import crypto from "crypto";
import axios from "axios";

import generateToken from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";

// Google client — client ID comes from env so the same code
// works in dev and production. Supports multiple client IDs
// (e.g. web + Android/iOS) as a comma-separated list.
// NOTE: read lazily inside googleAuth (not at import time) so dotenv
// has a chance to load before we check the value.
const getGoogleClientIds = () =>
  (process.env.GOOGLE_CLIENT_IDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const googleClient = new OAuth2Client();

// ---- Helpers ----
const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  image: user.image,
  providers: user.providers || [],
  isEmailVerified: !!user.isEmailVerified,
  wishlist: user.wishlist || [],
  addresses: user.addresses || [],
});

const addProvider = (user, provider) => {
  const providers = new Set([...(user.providers || []), provider]);
  // keep "local" if the user already had a password
  user.providers = [...providers];
};

// ==================
// NORMAL SIGNUP
// ==================
export const registerUser = async (req, res) => {
  try {
    /*
     * SECURITY: `role` is deliberately NOT read from req.body.
     *
     * This endpoint is public, so trusting a client-supplied role let anyone
     * self-register as an admin (`POST {"role":"admin"}`) and, because
     * `checkAdmin` gates the user/newsletter/site-settings routes, take over
     * the whole platform. Every self-registration is a `client`; roles are
     * granted deliberately via PATCH /api/v1/users/:id/role (admin-only).
     *
     * The sign-up form still offers a "Merchant" choice — that is only a
     * client-side hint, and the request's role is discarded. See the report.
     */
    const { name, email, phone, password } = req.body;

    // Basic validation. Existence booleans are logged rather than the values,
    // so no email/phone/password ever reaches the log.
    //
    // Each required field is reported by name so the form can point the user at
    // the right input, rather than the old generic "Please fill in all fields".
    const missing = [];
    if (!name) missing.push("name");
    if (!email) missing.push("email");
    if (!phone) missing.push("phone");
    if (!password) missing.push("password");

    if (missing.length > 0) {
      console.warn("Register rejected: missing required fields", missing);
      return res.status(400).json({
        message: `Please fill in all fields. Missing: ${missing.join(", ")}.`,
        missing,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn("Register rejected: email already registered");
      return res.status(400).json({ message: "User already exists" });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      console.warn("Register rejected: phone already registered");
      return res
        .status(400)
        .json({ message: "A user with this phone number already exists" });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      providers: ["local"],
      // Server-controlled. Never from the request body.
      role: "client",
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
    console.error("Register error:", error.message);

    /*
      Schema validation (e.g. `name` shorter than its minlength, a malformed
      email) is a client mistake, so it must be a 400 with the actual reason —
      not an opaque 500 "Server error". Previously a bad field produced a
      generic failure that looked like a server fault and gave the user nothing
      to act on.
    */
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors || {})
        .map((e) => e.message)
        .join(", ");
      return res.status(400).json({ message: message || "Invalid details" });
    }

    // Handle MongoDB duplicate key error (code 11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      return res.status(400).json({
        message: `A user with this ${field} already exists`,
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// ==================
// NORMAL LOGIN
// ==================
export const loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    if (!emailOrPhone || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email/phone and password" });
    }
    // NOTE: the request body (which contains the password) is deliberately not
    // logged here — see the register handler for the same reasoning.
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    })
      .select("+password")
      .populate("wishlist")
      .populate("addresses");

    if (!user) return res.status(400).json({ message: "User not found" });

    // OAuth-only accounts have no local password
    if (!user.password) {
      const linked = (user.providers || []).filter((p) => p !== "local");
      return res.status(400).json({
        message:
          linked.length > 0
            ? `This account was created with ${linked.join(" / ")}. Please continue with ${linked[0]}.`
            : "This account has no password set. Please use social login.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.status(200).json({
      user: sanitizeUser(user),
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
// Expects Google ID token (credential) from @react-oauth/google on client.
// Verifies it against GOOGLE_CLIENT_IDS, then finds-or-creates the user.
// ==================
export const googleAuth = async (req, res) => {
  try {
    // Accept { accessToken } (custom-button OAuth token flow) or legacy
    // ID-token shapes { idToken } / { credential } / { token }
    const idToken =
      req.body?.idToken || req.body?.credential || req.body?.token;
    const accessToken = req.body?.accessToken;
    if (!idToken && !accessToken) {
      return res.status(400).json({ message: "Google credential is required" });
    }
    const GOOGLE_CLIENT_IDS = getGoogleClientIds();
    if (GOOGLE_CLIENT_IDS.length === 0) {
      console.error("GOOGLE_CLIENT_IDS is not configured");
      return res
        .status(500)
        .json({ message: "Google login is not configured on the server" });
    }

    let payload;
    try {
      if (accessToken) {
        // Custom-button OAuth flow: exchange the access token for the
        // verified profile (sub/email/name/picture) straight from Google.
        const infoResp = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        if (!infoResp.ok) {
          throw new Error(
            `Google userinfo request failed (${infoResp.status})`,
          );
        }
        const info = await infoResp.json();
        payload = {
          sub: info.sub,
          email: info.email,
          name: info.name,
          picture: info.picture,
          email_verified:
            info.email_verified === true || info.email_verified === "true",
        };
      } else {
        const ticket = await googleClient.verifyIdToken({
          idToken,
          audience: GOOGLE_CLIENT_IDS,
        });
        payload = ticket.getPayload();
      }
    } catch (verifyErr) {
      console.error("Google token verification failed:", verifyErr.message);
      return res.status(401).json({ message: "Invalid Google credential" });
    }

    const { sub: googleId, email, name, picture, email_verified } = payload || {};

    if (!googleId || !email) {
      return res
        .status(400)
        .json({ message: "Google account did not return an email" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // Prefer matching by googleId, fall back to email (account linking)
    let user =
      (await User.findOne({ googleId })
        .populate("wishlist")
        .populate("addresses")) ||
      (await User.findOne({ email: normalizedEmail })
        .populate("wishlist")
        .populate("addresses"));

    let isNewUser = false;

    if (user) {
      // Link Google to an existing local account
      let changed = false;
      if (!user.googleId) {
        user.googleId = googleId;
        changed = true;
      }
      if (picture && !user.image) {
        user.image = picture;
        changed = true;
      }
      if (email_verified && !user.isEmailVerified) {
        user.isEmailVerified = true;
        changed = true;
      }
      const before = (user.providers || []).length;
      addProvider(user, "google");
      if ((user.providers || []).length !== before) changed = true;
      if (changed) await user.save();
    } else {
      // New user — no password, no phone required at signup
      isNewUser = true;
      user = await User.create({
        name: name || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        googleId,
        providers: ["google"],
        image: picture,
        isEmailVerified: !!email_verified,
        role: "client",
      });
      user = await User.findById(user._id)
        .populate("wishlist")
        .populate("addresses");
    }

    const jwtToken = generateToken(user);
    return res.status(200).json({
      user: sanitizeUser(user),
      token: jwtToken,
      role: user.role,
      isNewUser,
      message: isNewUser
        ? "Account created with Google"
        : "Logged in with Google",
    });
  } catch (error) {
    console.error("Google authentication error:", error);
    res
      .status(500)
      .json({ message: "Google authentication failed", error: error.message });
  }
};

// ==================
// APPLE LOGIN/SIGNUP — part 1: helpers
// ==================
const APPLE_JWKS_URL = "https://appleid.apple.com/auth/keys";
let appleJwksCache = { keys: [], fetchedAt: 0 };
const APPLE_JWKS_TTL = 1000 * 60 * 60; // 1 hour

const getAppleJwks = async () => {
  const now = Date.now();
  if (
    appleJwksCache.keys.length > 0 &&
    now - appleJwksCache.fetchedAt < APPLE_JWKS_TTL
  ) {
    return appleJwksCache.keys;
  }
  const { data } = await axios.get(APPLE_JWKS_URL, { timeout: 10000 });
  appleJwksCache = { keys: data.keys || [], fetchedAt: now };
  return appleJwksCache.keys;
};

const base64UrlToBuffer = (str) => {
  let b64 = String(str).replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  return Buffer.from(b64, "base64");
};

const verifyAppleIdentityToken = async (identityToken) => {
  const parts = String(identityToken).split(".");
  if (parts.length !== 3) throw new Error("Malformed Apple identity token");
  const [headerB64, payloadB64, signatureB64] = parts;

  const header = JSON.parse(base64UrlToBuffer(headerB64).toString("utf8"));
  const payload = JSON.parse(base64UrlToBuffer(payloadB64).toString("utf8"));

  const keys = await getAppleJwks();
  const jwk = keys.find((k) => k.kid === header.kid);
  if (!jwk) throw new Error("Apple public key not found (stale kid?)");

  // Verify RS256 signature with Node crypto (JWK import, no extra deps)
  const publicKey = crypto.createPublicKey({ key: jwk, format: "jwk" });
  const valid = crypto.verify(
    "RSA-SHA256",
    Buffer.from(`${headerB64}.${payloadB64}`),
    publicKey,
    base64UrlToBuffer(signatureB64),
  );
  if (!valid) throw new Error("Invalid Apple token signature");

  // Validate claims
  if (payload.iss !== "https://appleid.apple.com") {
    throw new Error("Invalid Apple token issuer");
  }
  const configuredAud = (process.env.APPLE_CLIENT_ID || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (configuredAud.length > 0 && !configuredAud.includes(payload.aud)) {
    throw new Error("Apple token audience mismatch");
  }
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000) - 60) {
    throw new Error("Apple token expired");
  }
  return payload;
};

// ==================
// APPLE LOGIN/SIGNUP — part 2: handler
// Body: { identityToken, user?: { firstName, lastName, email } }
// Apple only sends name/email on the FIRST authorization.
// ==================
export const appleAuth = async (req, res) => {
  try {
    const identityToken =
      req.body?.identityToken || req.body?.idToken || req.body?.token;
    if (!identityToken) {
      return res.status(400).json({ message: "Apple identity token required" });
    }

    let payload;
    try {
      payload = await verifyAppleIdentityToken(identityToken);
    } catch (verifyErr) {
      console.error("Apple token verification failed:", verifyErr.message);
      return res.status(401).json({ message: "Invalid Apple credential" });
    }

    const appleId = payload.sub;
    const tokenEmail = (payload.email || "").toLowerCase().trim();
    const forwardedEmail = (req.body?.user?.email || "").toLowerCase().trim();
    const email = tokenEmail || forwardedEmail;

    if (!appleId || !email) {
      return res.status(400).json({
        message: "Apple account did not return an email. Please try again.",
      });
    }

    const forwardedName = [req.body?.user?.firstName, req.body?.user?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    let user =
      (await User.findOne({ appleId })
        .populate("wishlist")
        .populate("addresses")) ||
      (await User.findOne({ email }).populate("wishlist").populate("addresses"));

    let isNewUser = false;

    if (user) {
      let changed = false;
      if (!user.appleId) {
        user.appleId = appleId;
        changed = true;
      }
      if (!user.name && forwardedName) {
        user.name = forwardedName;
        changed = true;
      }
      const emailVerified =
        payload.email_verified === true || payload.email_verified === "true";
      if (emailVerified && !user.isEmailVerified) {
        user.isEmailVerified = true;
        changed = true;
      }
      const before = (user.providers || []).length;
      addProvider(user, "apple");
      if ((user.providers || []).length !== before) changed = true;
      if (changed) await user.save();
    } else {
      isNewUser = true;
      user = await User.create({
        name: forwardedName || email.split("@")[0],
        email,
        appleId,
        providers: ["apple"],
        isEmailVerified: true,
        role: "client",
      });
      user = await User.findById(user._id)
        .populate("wishlist")
        .populate("addresses");
    }

    const jwtToken = generateToken(user);
    return res.status(200).json({
      user: sanitizeUser(user),
      token: jwtToken,
      role: user.role,
      isNewUser,
      message: isNewUser ? "Account created with Apple" : "Logged with Apple",
    });
  } catch (error) {
    console.error("Apple authentication error:", error);
    res
      .status(500)
      .json({ message: "Apple authentication failed", error: error.message });
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

// =====================================
// CHANGE PASSWORD (logged-in user)
// =====================================
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide new password",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }

    const user = await User.findById(req.user._id).select(
      "+password resetPasswordToken resetPasswordExpire",
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // OAuth-only accounts have no password yet — allow setting one
    // without currentPassword so they can also log in with email/phone.
    if (user.password) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Please provide current password",
        });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Current password is incorrect" });
      }
    } else {
      // First password for an OAuth user → also mark as local provider
      addProvider(user, "local");
    }

    user.password = newPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ==================
// LOGOUT USER
// ==================
export const logoutUser = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};
