import asyncHandler from "express-async-handler";
import Customization from "../models/Customization.js";
import { v2 as cloudinary } from "cloudinary";

// @desc    Submit a new card customization
// @route   POST /api/v1/customize
// @access  Public / Private
const createCustomization = asyncHandler(async (req, res) => {
  const {
    groomName,
    brideName,
    eventDate,
    venue,
    message,
    selectedFont,
    selectedColor,
    selectedBorder,
    selectedTemplate,
    uploadedImages,
  } = req.body;

  // Validation
  if (!groomName || !brideName || !eventDate || !venue) {
    res.status(400);
    throw new Error(
      "Groom name, bride name, event date, and venue are required",
    );
  }

  const customizationData = {
    groomName,
    brideName,
    eventDate,
    venue,
    message: message || "",
    selectedFont,
    selectedColor,
    selectedBorder,
    selectedTemplate,
    uploadedImages: uploadedImages || [],
  };

  // Attach user if authenticated
  if (req.user && req.user._id) {
    customizationData.user = req.user._id;
  }

  const customization = await Customization.create(customizationData);

  res.status(201).json({
    success: true,
    message: "Card customization saved successfully!",
    data: customization,
  });
});

// @desc    Upload images for customization
// @route   POST /api/v1/customize/upload
// @access  Public / Private
const uploadCustomizationImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("No files uploaded");
  }

  const imageUrls = req.files.map((file) => file.path);

  res.status(200).json({
    success: true,
    message: "Images uploaded successfully",
    data: imageUrls,
  });
});

// @desc    Get all customizations (admin)
// @route   GET /api/v1/customize
// @access  Private/Admin
const getAllCustomizations = asyncHandler(async (req, res) => {
  const customizations = await Customization.find()
    .sort({ createdAt: -1 })
    .populate("user", "name email");

  res.status(200).json({
    success: true,
    count: customizations.length,
    data: customizations,
  });
});

// @desc    Get user's own customizations
// @route   GET /api/v1/customize/my
// @access  Private
const getMyCustomizations = asyncHandler(async (req, res) => {
  const customizations = await Customization.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: customizations.length,
    data: customizations,
  });
});

// @desc    Get single customization by ID
// @route   GET /api/v1/customize/:id
// @access  Private
const getCustomizationById = asyncHandler(async (req, res) => {
  const customization = await Customization.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (!customization) {
    res.status(404);
    throw new Error("Customization not found");
  }

  res.status(200).json({
    success: true,
    data: customization,
  });
});

// @desc    Delete customization
// @route   DELETE /api/v1/customize/:id
// @access  Private/Admin
const deleteCustomization = asyncHandler(async (req, res) => {
  const customization = await Customization.findById(req.params.id);

  if (!customization) {
    res.status(404);
    throw new Error("Customization not found");
  }

  // Check ownership or admin
  if (
    customization.user &&
    customization.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to delete this customization");
  }

  await customization.deleteOne();

  res.status(200).json({
    success: true,
    message: "Customization deleted successfully",
  });
});

export {
  createCustomization,
  uploadCustomizationImages,
  getAllCustomizations,
  getMyCustomizations,
  getCustomizationById,
  deleteCustomization,
};
