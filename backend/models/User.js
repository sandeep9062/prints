import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is not there"],
      trim: true,
      minLength: 2,
      maxLength: 80,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      // Optional for OAuth users (Google/Apple don't always provide it).
      // unique + sparse lets many users have no phone without collisions.
      unique: true,
      sparse: true,
      trim: true,
    },

    password: {
      type: String,
      // Required only for local (email/phone) accounts.
      // OAuth-only accounts have no password until they set one.
      required: function () {
        return !this.googleId && !this.appleId;
      },
      minLength: 8,
      maxLength: 9950,
      select: false,
    },

    // ---------- OAuth ----------
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    appleId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    providers: {
      type: [String],
      enum: ["local", "google", "apple"],
      default: ["local"],
    },
    // Email verified by the OAuth provider (Google/Apple)
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["client", "admin", "merchant"],
      default: "client",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
    },
    // Password reset (forgot-password flow)
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },

    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true },
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password || !enteredPassword) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    // OAuth users may have password unset — skip hashing in that case
    if (!this.password) {
      return next();
    }

    console.log("🔐 Hashing password...");
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    console.error("🔥 Pre-save hook error:", err.message);
    next(err);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
