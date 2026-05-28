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

const router = express.Router();

router.route("/").post(upload.single("coverImage"), createBlog).get(getBlogs);
router.post("/seed", seedBlogs);
router
  .route("/:id")
  .get(getBlogById)
  .put(upload.single("coverImage"), updateBlog)
  .delete(deleteBlog);
router.route("/slug/:slug").get(getBlogBySlug);

export default router;
