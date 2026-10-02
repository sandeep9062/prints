import asyncHandler from "express-async-handler";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, price, customization } = req.body;
  const user = req.user._id;

  let cart = await Cart.findOne({ user });

  if (cart) {
    // Cart exists for user
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        JSON.stringify(item.customization) === JSON.stringify(customization)
    );

    if (itemIndex > -1) {
      // Product exists in cart, update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Product does not exist in cart, add new item
      cart.items.push({ product: productId, quantity, price, customization });
    }
    cart = await cart.save();
    res.status(200).json(cart);
  } else {
    // No cart for user, create new cart
    cart = await Cart.create({
      user,
      items: [{ product: productId, quantity, price, customization }],
    });
    res.status(201).json(cart);
  }
});

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getUserCart = asyncHandler(async (req, res) => {
  const user = req.user._id;

  const cart = await Cart.findOne({ user }).populate("items.product", "name images");

  if (cart) {
    res.status(200).json(cart);
  } else {
    res.status(200).json({ items: [] }); // Return an empty cart if none exists
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeItemFromCart = asyncHandler(async (req, res) => {
  const { id } = req.params; // Cart item _id
  const user = req.user._id;

  let cart = await Cart.findOne({ user });

  if (cart) {
    cart.items = cart.items.filter((item) => item._id.toString() !== id);
    cart = await cart.save();
    res.status(200).json(cart);
  } else {
    res.status(404).json({ message: "Cart not found" });
  }
});

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { id } = req.params; // Cart item _id
  const { quantity } = req.body;
  const user = req.user._id;

  let cart = await Cart.findOne({ user });

  if (cart) {
    const itemIndex = cart.items.findIndex((item) => item._id.toString() === id);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      cart = await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } else {
    res.status(404).json({ message: "Cart not found" });
  }
});

// @desc    Clear user cart
// @route   DELETE /api/cart
// @access  Private
const clearUserCart = asyncHandler(async (req, res) => {
  const user = req.user._id;

  let cart = await Cart.findOne({ user });

  if (cart) {
    cart.items = [];
    cart = await cart.save();
    res.status(200).json(cart);
  } else {
    res.status(404).json({ message: "Cart not found" });
  }
});

export { addItemToCart, getUserCart, removeItemFromCart, updateCartItemQuantity, clearUserCart };
