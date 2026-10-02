// controllers/products.controller.js
import Product from "../models/Product.js";
import slugify from "slugify";
import { products } from "../data/product.ts";

// =====================================
// CREATE PRODUCT
// =====================================
export const createProduct = async (req, res) => {
  try {
    const { productData } = req.body;

    if (!productData) {
      return res
        .status(400)
        .json({ success: false, message: "Product data is missing" });
    }

    const {
      name,
      description,
      badge,
      price,
      discountPrice,
      category,
      stock,
      dimensions,
      options,
    } = JSON.parse(productData);
    const owner = req.user?._id; // Assuming auth middleware sets req.user

    const images = req.files ? req.files.map((file) => file.path) : [];

    if (images.length === 0) {
      res.status(400);
      throw new Error("No images uploaded");
    }

    const slug = slugify(name, { lower: true });

    const product = await Product.create({
      owner,
      name,
      slug,
      description,
      badge,
      price,
      discountPrice,
      images,
      category,
      stock,
      dimensions,
      options,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// SEED PRODUCTS
// =====================================
export const seedProducts = async (req, res) => {
  try {
    // Clear existing products
    await Product.deleteMany({});

    // Add unique product codes to avoid duplicate key error
    const productsWithCodes = products.map((product, index) => ({
      ...product,
      productCode: `PRD-${String(index + 1).padStart(4, "0")}`,
    }));

    // Insert new products with unordered to continue on errors
    const createdProducts = await Product.insertMany(productsWithCodes, {
      ordered: false,
    });

    res.status(201).json({
      success: true,
      message: `Successfully seeded ${createdProducts.length} products`,
      count: createdProducts.length,
      products: createdProducts,
    });
  } catch (error) {
    console.error("Seed Products Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// DELETE PRODUCT IMAGE
// =====================================
export const deleteProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Remove the image from the array
    product.images = product.images.filter((img) => img !== imageUrl);

    await product.save();

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      product,
    });
  } catch (error) {
    console.error("Delete Product Image Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// GET ALL PRODUCTS
// =====================================
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// GET PRODUCT BY ID
// =====================================
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// GET PRODUCT BY SLUG
// =====================================
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate(
      "category",
    );

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Get Product By Slug Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// GET PRODUCTS BY USER
// =====================================
export const getProductsByUser = async (req, res) => {
  try {
    const products = await Product.find({ owner: req.user._id }).populate(
      "category",
    );
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Products by User Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// UPDATE PRODUCT
// =====================================
export const updateProduct = async (req, res) => {
  try {
    const { productData } = req.body;

    if (!productData) {
      return res
        .status(400)
        .json({ success: false, message: "Product data is missing" });
    }

    const {
      name,
      description,
      badge,
      price,
      discountPrice,
      category,
      stock,
      dimensions,
      options,
      images: existingImages, // Client might send back the list of existing images
    } = JSON.parse(productData);

    const newImages = req.files ? req.files.map((file) => file.path) : [];

    let updateData = {
      name,
      description,
      badge,
      price,
      discountPrice,
      category,
      stock,
      dimensions,
      options,
      images: [...(existingImages || []), ...newImages], // Combine old and new images
    };

    // Generate new slug if name changed
    if (name) {
      updateData.slug = slugify(name, { lower: true });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// DELETE PRODUCT
// =====================================
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
