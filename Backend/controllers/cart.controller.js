// controllers/cart.controller.js
import { Cart } from "../models/cart.model.js";
import { Coupon } from "../models/coupon.model.js";
import { errorHandler } from "../utils/error.js";

// Get Cart Details
export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ belongTo: req.user.id }).populate("coupon");
    if (!cart) return res.status(404).json({ message: "Cart not found." });

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

// Add or Update Cart Item
export const addOrUpdateCartItem = async (req, res, next) => {

  const { productId, quantity } = req.body;
  console.log("user in cart",req.user.id);
  if (!productId || quantity < 1)
    return res.status(400).json({ message: "Invalid product or quantity." });

  try {
    const cart = await Cart.findOneAndUpdate(
      { belongTo: req.user.id },
      {
        $setOnInsert: { belongTo: req.user.id },
        $set: { "items.$[item].quantity": quantity },
        $push: { items: { productId, quantity } },
      },
      {
        upsert: true,
        arrayFilters: [{ "item.productId": productId }],
        new: true,
      }
    );

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

// Remove Item from Cart
export const removeCartItem = async (req, res, next) => {
  const { productId } = req.body;
  if (!productId)
    return res.status(400).json({ message: "Product ID is required." });

  try {
    const cart = await Cart.findOneAndUpdate(
      { belongTo: req.user.id },
      { $pull: { items: { productId } } },
      { new: true }
    );

    if (!cart) return res.status(404).json({ message: "Cart not found." });

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

// Apply Coupon to Cart
export const applyCoupon = async (req, res, next) => {
  const { couponCode } = req.body;
  if (!couponCode)
    return res.status(400).json({ message: "Coupon code is required." });

  try {
    const coupon = await Coupon.findOne({ couponCode, isActive: true });
    if (!coupon)
      return res.status(404).json({ message: "Invalid or inactive coupon." });

    const cart = await Cart.findOneAndUpdate(
      { belongTo: req.user.id },
      { coupon: coupon._id },
      { new: true }
    );

    if (!cart) return res.status(404).json({ message: "Cart not found." });

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

// Clear Cart
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { belongTo: req.user.id },
      { items: [], coupon: null },
      { new: true }
    );

    if (!cart) return res.status(404).json({ message: "Cart not found." });

    res.status(200).json({ message: "Cart cleared successfully." });
  } catch (error) {
    next(error);
  }
};
