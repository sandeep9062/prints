import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Middleware to protect routes and set req.user
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token and decode payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userId = decoded.id;

      if (!userId) {
        return res.status(401).json({ message: "Invalid token payload" });
      }

      // Find user by ID, exclude password
      const user = await User.findById(userId).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user; // attach user to request

      next();
    } catch (error) {
      console.error("JWT Error:", error);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

// Middleware to check if user is admin
export const checkAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};

/**
 * Role gate. Must run AFTER `protect` (it reads `req.user`).
 *
 * `checkAdmin` is kept as-is for backwards compatibility; this is the general
 * form used by new routes:
 *   router.put("/:id", protect, authorize("merchant", "admin"), handler)
 *
 * Returns 403 rather than 401 for an authenticated user in the wrong role —
 * 401 would wrongly imply "log in again".
 */
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Requires one of: ${roles.join(", ")}.`,
      });
    }
    next();
  };

/**
 * Ownership gate for a single document.
 *
 * Loads `Model.findById(req.params[paramName])`, then:
 *   - 404 when the document doesn't exist
 *   - 403 unless the caller is an admin OR the document's `ownerField`
 *     equals the caller's id
 *
 * On success the document is attached as `req.doc` so the controller can use
 * it directly instead of re-querying (which also avoids a TOCTOU window
 * between the permission check and the write).
 *
 * Comparing ObjectIds: `String(a) === String(b)` is used rather than `.equals()`
 * so a plain string owner (legacy documents) compares correctly too.
 *
 * Must run AFTER `protect`.
 *
 *   router.put(
 *     "/:id",
 *     protect,
 *     authorize("merchant", "admin"),
 *     isOwnerOrAdmin(Product),
 *     updateProduct,
 *   );
 */
export const isOwnerOrAdmin = (
  Model,
  { ownerField = "owner", paramName = "id" } = {},
) => async (req, res, next) => {
  const id = req.params?.[paramName];
  if (!id) {
    return res.status(400).json({ message: "Missing resource id" });
  }

  let doc;
  try {
    doc = await Model.findById(id);
  } catch {
    // Malformed ObjectId — don't leak a CastError to the client.
    return res.status(404).json({ message: "Resource not found" });
  }

  if (!doc) {
    return res.status(404).json({ message: "Resource not found" });
  }

  const isAdmin = req.user?.role === "admin";
  const ownerId = doc[ownerField];
  const isOwner =
    ownerId != null &&
    req.user?._id != null &&
    String(ownerId) === String(req.user._id);

  if (!isAdmin && !isOwner) {
    return res.status(403).json({
      message: "Access denied. You do not own this resource.",
    });
  }

  req.doc = doc;
  next();
};
