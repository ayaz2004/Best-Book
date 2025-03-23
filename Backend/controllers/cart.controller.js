// controllers/cart.controller.js
import { Cart } from "../models/cart.model.js";
import { Coupon } from "../models/coupon.model.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import Book from "../models/book.model.js";
import { Quiz } from "../models/quiz.model.js";
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message.js";
// Get Cart Details
export const getCart = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ belongTo: userId });
    if (!cart) return next(errorHandler(404, "Cart not found"));

    let cartData = { items: [] };

    // Use for...of loop to await each async operation
    for (const item of cart.items) {
      let product = null;

      if (item.productType === "Book" || item.productType === "ebook") {
        product = await Book.findById(item.productId);
        if (!product) return next(errorHandler(404, "Book not found"));
      } else if (item.productType === "Quiz") {
        product = await Quiz.findById(item.productId);
        if (!product) return next(errorHandler(404, "Quiz not found"));
      }
      // else {
      //   return next(errorHandler(404, "Product type not recognized"));
      // }

      // Add the found product to the cartData
      // console.log(product);
      cartData.items.push({
        product: {
          _id: product._id,
          title: product.title,
          price: product.price,
          coverImage: product.coverImage,
          ebookDiscount: product.ebookDiscount,
          hardcopyDiscount: product.hardcopyDiscount,
          stock: product.stock,
        },
        quantity: item.quantity,
        productType: item.productType,
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "cart fetch successfully", cartData });
  } catch (error) {
    next(errorHandler(500, "Failed to fetch cart"));
  }
};

export const addOrUpdateCartItem = async (req, res, next) => {
  const { productId, quantity, bookType } = req.body;
  const userId = req.user.id;
  console.log(req.body);
  try {
    // Input validation
    if (!productId || !quantity || !bookType || quantity < 1) {
      return res.status(400).json({
        message:
          "Invalid input: Product ID and quantity (minimum 1) are required.",
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Check if product exists and determine its type
    const book = await Book.findById(productId);
    const quiz = await Quiz.findById(productId);

    let productType;
    if (book) {
      productType = bookType;
    } else if (quiz) {
      productType = "Quiz";
    } else {
      return next(errorHandler(404, "Product not found"));
    }

    // Find or create cart
    let cart = await Cart.findOne({ belongTo: userId });
    if (!cart) {
      cart = new Cart({
        belongTo: userId,
        items: [],
      });
    }

    // Update existing item or add new item
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.productType === productType
    );


    if (
      existingItemIndex !== -1 &&
      cart.items[existingItemIndex].productType === productType
    ) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
    }
    // Add new item with productType
    else {
      cart.items.push({
        productId,
        quantity,
        productType, // Include the productType here
      });
    }
    // Save cart
    await cart.save();

    // Return updated cart with populated data
    const updatedCart = await Cart.findById(cart._id)
      .populate("belongTo")
      .populate({
        path: "items.productId",
        model: productType === "Book" ? Book : Quiz,
      });

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      updatedCart,
    });
  } catch (error) {
    console.error("Cart operation failed:", error);
    next(errorHandler(500, "Failed to update cart"));
  }
};

export const updateCartQuantity = async (req, res, next) => {
  const { productId, quantity } = req.body;

  try {
    // Validate input
    if (!productId || quantity < 1) {
      return res.status(400).json({
        message:
          "Invalid input: Product ID and quantity (minimum 1) are required.",
      });
    }

    // Find cart and update item quantity
    const cart = await Cart.findOne({ belongTo: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart." });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    // Fetch updated cart with populated data
    let cartData = { items: [] };

    for (const item of cart.items) {
      let product = null;

      if (item.productType === "Book" || item.productType === "ebook") {
        product = await Book.findById(item.productId);
      } else if (item.productType === "Quiz") {
        product = await Quiz.findById(item.productId);
      }

      if (product) {
        cartData.items.push({
          product: {
            _id: product._id,
            title: product.title,
            price: product.price,
            coverImage: product.coverImage,
            ebookDiscount: product.ebookDiscount,
            hardcopyDiscount: product.hardcopyDiscount,
          },
          quantity: item.quantity,
          productType: item.productType,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Quantity updated successfully",
      cartData,
    });
  } catch (error) {
    next(error);
  }
};

// Remove Item from Cart
export const removeCartItem = async (req, res, next) => {
  const { productId, productType } = req.body;
  if (!productId || !productType || productType.trim() === "")
    return next(errorHandler(400, "Product ID and type are required."));

  try {
    const cart = await Cart.findOneAndUpdate(
      { belongTo: req.user.id },
      { $pull: { items: { productId, productType } } },
      { new: true }
    );

    if (!cart) return next(errorHandler(404, "Cart not found."));

    res.status(200).json(cart);
  } catch (error) {
    next(errorHandler(500, "Failed to remove item from cart"));
  }
};

// // Apply Coupon to Cart
// export const applyCoupon = async (req, res, next) => {
//   const { couponCode } = req.body;
//   if (!couponCode)
//     return res.status(400).json({ message: "Coupon code is required." });

//   try {
//     const coupon = await Coupon.findOne({ couponCode, isActive: true });
//     if (!coupon)
//       return res.status(404).json({ message: "Invalid or inactive coupon." });

//     const cart = await Cart.findOneAndUpdate(
//       { belongTo: req.user.id },
//       { coupon: coupon._id },
//       { new: true }
//     );

//     if (!cart) return res.status(404).json({ message: "Cart not found." });

//     res.status(200).json({
//       success: true,
//       message: "Coupon applied successfully",
//       discountPercentage: coupon.discountPercentage,
//       couponCode: coupon.couponCode,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

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
