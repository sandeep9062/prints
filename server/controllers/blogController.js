import Blog from "../models/Blog.js";
import asyncHandler from "express-async-handler";
import { blogPosts } from "../data/blog.ts";

// @desc    Seed blog posts from data file
// @route   POST /api/blogs/seed
// @access  Public/Admin
const seedBlogs = asyncHandler(async (req, res) => {
  // Clear existing blog posts
  await Blog.deleteMany({});

  // Insert new blog posts
  const createdBlogs = await Blog.insertMany(blogPosts, {
    ordered: false,
  });

  res.status(201).json({
    success: true,
    message: `Successfully seeded ${createdBlogs.length} blog posts`,
    count: createdBlogs.length,
  });
});

// @desc    Create new blog post
// @route   POST /api/blogs
// @access  Private/Admin
const createBlog = asyncHandler(async (req, res) => {
  const {
    title,
    slug,
    category,
    excerpt,
    content,
    targetSector,
    metaTitle,
    keywords,
  } = req.body;
  const coverImage = req.file ? req.file.secure_url : null;

  const blogExists = await Blog.findOne({ title });

  if (blogExists) {
    res.status(400);
    throw new Error("Blog post with this title already exists");
  }

  let parsedKeywords = keywords;
  if (typeof keywords === "string") {
    try {
      parsedKeywords = JSON.parse(keywords);
    } catch {
      parsedKeywords = keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
    }
  }

  const blog = new Blog({
    title,
    slug: slug
      ? slug.toLowerCase().replace(/ /g, "-")
      : title.toLowerCase().replace(/ /g, "-"),
    category,
    excerpt,
    content,
    coverImage,
    targetSector,
    metaTitle,
    keywords: parsedKeywords,
  });

  const createdBlog = await blog.save();
  res.status(201).json(createdBlog);
});

// @desc    Get all blog posts
// @route   GET /api/blogs
// @access  Public
const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

// @desc    Get blog post by ID
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (blog) {
    res.json(blog);
  } else {
    res.status(404);
    throw new Error("Blog post not found");
  }
});

// @desc    Update blog post
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlog = asyncHandler(async (req, res) => {
  const {
    title,
    slug,
    category,
    excerpt,
    content,
    targetSector,
    metaTitle,
    keywords,
  } = req.body;
  const coverImage = req.file ? req.file.secure_url : null;

  const blog = await Blog.findById(req.params.id);

  if (blog) {
    blog.title = title || blog.title;
    blog.slug = slug
      ? slug.toLowerCase().replace(/ /g, "-")
      : title
        ? title.toLowerCase().replace(/ /g, "-")
        : blog.slug;
    blog.category = category || blog.category;
    blog.excerpt = excerpt || blog.excerpt;
    blog.content = content || blog.content;
    blog.coverImage = coverImage || blog.coverImage;
    blog.targetSector = targetSector || blog.targetSector;
    blog.metaTitle = metaTitle || blog.metaTitle;
    if (keywords !== undefined) {
      if (typeof keywords === "string") {
        try {
          blog.keywords = JSON.parse(keywords);
        } catch {
          blog.keywords = keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean);
        }
      } else {
        blog.keywords = keywords;
      }
    }

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } else {
    res.status(404);
    throw new Error("Blog post not found");
  }
});

// @desc    Delete blog post
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (blog) {
    await blog.deleteOne();
    res.json({ message: "Blog post removed" });
  } else {
    res.status(404);
    throw new Error("Blog post not found");
  }
});

// @desc    Get blog post by slug
// @route   GET /api/blogs/slug/:slug
// @access  Public
const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });

  if (blog) {
    res.json(blog);
  } else {
    res.status(404);
    throw new Error("Blog post not found");
  }
});

export {
  seedBlogs,
  createBlog,
  getBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
};
