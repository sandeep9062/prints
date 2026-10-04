import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import siteSettingsRoutes from "./routes/siteSettingsRoutes.js";
import websiteImageRoutes from "./routes/websiteImageRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import enquiryRoutes from "./routes/enquiryRoute.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import chatbotRouter from "./routes/chatbotRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import customizationRoutes from "./routes/customizationRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 9000;

/*
 * Fail fast on a missing JWT secret.
 *
 * There is deliberately no fallback default: a hard-coded secret would let
 * anyone who read the source mint valid admin tokens. Refusing to boot is
 * safer than booting with a guessable key.
 */
if (!process.env.JWT_SECRET) {
  console.error(
    "FATAL: JWT_SECRET is not set. Refusing to start — set it in your .env file.",
  );
  process.exit(1);
}

// Security headers (CSP, clickjacking protection, HSTS, no-sniff, …).
// crossOriginResourcePolicy is relaxed so images served from Cloudinary can be
// embedded by the frontend origin.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// Broad backstop against scraping/abuse across the whole API.
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    // Disabled under test so one rate-limit assertion cannot cause unrelated
    // tests to fail with a 429. The limiter is exercised directly in
    // tests/security.test.js via a dedicated instance.
    skip: () => process.env.NODE_ENV === "test",
    message: { success: false, message: "Too many requests. Please try again later." },
  }),
);

/*
 * Tighter limit on credential endpoints.
 *
 * 10 attempts per 15 minutes per IP blunts brute-force and credential-stuffing
 * against /login and /register without being tight enough to trip a shared
 * office/NAT connection during normal use.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "test",
  message: {
    success: false,
    message: "Too many attempts. Please try again in 15 minutes.",
  },
});

app.use("/api/v1/auth/login", authLimiter);
app.use("/api/v1/auth/register", authLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // read cookies from incoming request,so that app can store user data

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://www.inkofmemories.com",
  "https://inkofmemories.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send(`Server is running on PORT: ${PORT}`);
});

// API routes

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/website-images", websiteImageRoutes);
app.use("/api/v1/site-settings", siteSettingsRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/enquiry", enquiryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/chatbot", chatbotRouter);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/customize", customizationRoutes);
app.use("/api/v1/newsletter", newsletterRoutes);

// Error middleware (must be after all routes)
app.use(errorMiddleware);

/*
 * Exporting the app as well as listening means the integration tests can mount
 * it with supertest instead of binding a port.
 */
export default app;

// Start server
const server = app.listen(PORT, async () => {
  console.log(`✅ Server Running at http://localhost:${PORT}`);

  await connectDB();
});

export { server };
