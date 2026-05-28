import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
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
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // read cookies from incoming request,so that app can store user data

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

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

// Error middleware (must be after all routes)
app.use(errorMiddleware);

// Start server
app.listen(PORT, async () => {
  console.log(`✅ Server Running at http://localhost:${PORT}`);

  await connectDB();
});
