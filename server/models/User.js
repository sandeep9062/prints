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
      required: [true, "phone is required"],
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "User password is not there"],
      minLength: 8,
      maxLength: 9950,
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
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  try {
    console.log(
      "🔐 Pre-save hook triggered. isModified('password'):",
      this.isModified("password"),
    );
    if (!this.isModified("password")) {
      console.log("🔐 Password not modified, skipping hash");
      return next();
    }

    console.log("🔐 Hashing password...");
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("🔐 Password hashed successfully");
    next();
  } catch (err) {
    console.error("🔥 Pre-save hook error:", err.message);
    next(err);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
