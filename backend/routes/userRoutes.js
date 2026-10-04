import express from "express";

import { authorize, checkAdmin, protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";
import {
  bookVisit,
  cancelVisit,
  createUser,
  deleteUser,
  getAllCustomers,
  getCustomerById,
  getUser,
  getUsers,
  toggleFavourite,
  updateProfile,
  updateUser,
  updateUserRole,
  userFavourites,
  userProfile,
  addAddress,
  getMyAddresses,
  updateAddress,
  deleteAddress,
  getMyOrders,
} from "../controllers/userController.js";

const router = express.Router();
// login and register is part of authRoutes

// ✅ Profile Update Route (with image upload)
router.put("/profile-update", protect, upload.single("image"), updateProfile);

// ✅ Get logged-in user's profile
router.get("/profile", userProfile);

// ✅ Get all favourite properties of a user
router.get("/favourites", protect, userFavourites);

// ✅ My Orders (logged-in user) — must be BEFORE /:id
router.get("/my-orders", protect, getMyOrders);

// ✅ Address Routes (protect - logged in user) — must be BEFORE /:id
router.post("/address", protect, addAddress);
router.get("/address", protect, getMyAddresses);
router.put("/address/:id", protect, updateAddress);
router.delete("/address/:id", protect, deleteAddress);

// ✅ Customer Management Routes (for merchants) — must be BEFORE /:id
router.get("/customers/all", protect, getAllCustomers);
router.get("/customers/:id", protect, getCustomerById);

/*
 * ROUTE GUARDS — audit notes
 * ----------------------------
 * `getUser` (GET /:id) was previously PUBLIC and returned a full user record
 * minus the password, which leaked email, phone and role for any account to
 * anyone who could guess an id. It is now admin-only.
 *
 * `updateUser` (PUT /:id) was guarded by `protect` alone, letting any
 * logged-in user edit any other account. Role changes moved to the dedicated
 * admin-only PATCH /:id/role.
 */
router.get("/:id", protect, checkAdmin, getUser);

// ✅ Create a new user
router.post("/", createUser);

// ✅ Get all users
router.get("/", protect, checkAdmin, getUsers);

// ✅ Update user by ID (name/email only — see updateUser for the allowlist)
router.put("/:id", protect, authorize("admin"), updateUser);

// ✅ Admin-only role assignment — the only path that can change a role.
router.patch(
  "/:id/role",
  protect,
  checkAdmin,
  updateUserRole,
);

// ✅ Add/Remove Favourite Route
router.post("/toFav/:propId", protect, toggleFavourite);

// ✅ Book a property visit
router.post("/bookings", protect, bookVisit);

// ✅ Cancel a property visit
router.delete("/bookings/:propertyId", protect, cancelVisit);

// ✅ Delete user by ID
router.delete("/:id", protect, checkAdmin, deleteUser);

export default router;
