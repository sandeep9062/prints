import express from "express";
import {
  seedBlogs,
  createBlog,
  getBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";

import upload from "../middlewares/multer.js";
import { protect, checkAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/*
 * GUARDS — audit notes
 * --------------------
 * Reads are public (the blog is a marketing surface): GET /, /:id, /slug/:slug.
 *
 * Writes had NO authentication at all — anyone, unauthenticated, could create,
 * edit or delete posts. They are now admin-only.
 */
router.route("/").post(protect, checkAdmin, upload.single("coverImage"), createBlog).get(getBlogs);
router.post("/seed", protect, checkAdmin, seedBlogs);
router
  .route("/:id")
  .get(getBlogById)
  .put(protect, checkAdmin, upload.single("coverImage"), updateBlog)
  .delete(protect, checkAdmin, deleteBlog);
router.route("/slug/:slug").get(getBlogBySlug);

export default router;
