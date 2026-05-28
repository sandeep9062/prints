import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Middleware to optionally attach user if token is present, but does NOT block unauthenticated requests
export const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      if (userId) {
        const user = await User.findById(userId).select("-password");
        req.user = user;
      }
    } catch (error) {
      // Token invalid or expired, just continue without user
      console.log("Optional auth: invalid token, continuing as guest");
    }
  }

  next();
};
