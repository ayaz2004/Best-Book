import { errorHandler } from "../utils/error.js";
import { Order } from "../models/orders.model.js";
import { OrderStatusEnum } from "../utils/constant.js";
import { AvailableOrderStatuses } from "../utils/constant.js";
import { PaymentProviderEnum } from "../utils/constant.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Book from "../models/book.model.js";
import { Quiz } from "../models/quiz.model.js";
import { Cart } from "../models/cart.model.js";
import Address from "../models/address.model.js";
import { Coupon } from "../models/coupon.model.js";
import { validate } from "uuid";
export const placeOrder = async (req, res, next) => {
  const {
    userId,
    items,
    shippingAddress,
    totalAmount,
    paymentProvider,
    isPaymentDone,
  } = req.body;

  try {
    // if (!userId  || !shippingAddress || !totalAmount || paymentProvider !== "" || isPaymentDone === null || isPaymentDone === undefined) {
    //   return next(errorHandler(400, "Invalid data"));
    // }

    // const cartItems = await Cart.findById(cartId);

    // if(req.user._id !== userId){
    //     return next(errorHandler(403, "Unauthorized"));
    // }
    const {
      firstName,
      lastName,
      phone,
      address1,
      address2,
      city,
      state,
      pincode,
      country,
      isDefault,
    } = shippingAddress;
    const user = await User.findById(userId);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    shippingAddress.userId = userId;
    // let totalPrice = 0;
    const validateItems = [];
    const subscribedEbook = [];
    for (const item of items) {
      const productId = item.product._id;
      if (!productId || !item.quantity) {
        return next(errorHandler(400, "Invalid data"));
      }

      if (item.quantity <= 0) {
        return next(errorHandler(400, "Invalid quantity"));
      }

      const product =
        item.productType === "Book" || "ebook"
          ? await Book.findById({ _id: productId })
          : await Quiz.findById({ _id: productId });
      if (item.productType === "ebook") {
        subscribedEbook.push(item.product.id);
        console.log(subscribedEbook);
      }

      if (!product) {
        return next(errorHandler(404, "Product not found"));
      }

      if (product.stock < item.quantity) {
        return next(errorHandler(400, "Insufficient stock"));
      }

      product.stock -= item.quantity;
      await product.save({ validateBeforeSave: false });

      // totalPrice += product.price * item.quantity; // + delivery charged
      validateItems.push({ product, quantity: item.quantity });
    }

    // const address = new Address({
    //   userId,
    //   firstName,
    //   lastName,
    //   phone,
    //   address1,
    //   address2,
    //   city,
    //   state,
    //   pincode,
    //   country,
    //   isDefault,
    // });
    const uniqueEbooks = subscribedEbook.filter(
      (ebookId) => !user.subscribedEbook.includes(ebookId)
    );

    user.subscribedEbook = [...user.subscribedEbook, ...uniqueEbooks];
    await user.save({ validateBeforeSave: false });
    // await address.save();
    const order = new Order({
      userId,
      username: user.username,
      items: validateItems,
      totalAmount,
      shippingAddress: shippingAddress,
      paymentProvider: PaymentProviderEnum.COD,
      isPaymentDone,
    });

    // user.subscribedEbook = [...user.subscribedEbook, ...subscribedEbook];
    // await user.save({ validateBeforeSave: true });

    await order.save();
    
    // console.log(req.user._id);
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: { orderId: order._id },
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const applyCoupon = async (req, res, next) => {
  const { couponCode } = req.body;

  if (!couponCode)
    return res.status(400).json({ message: "Coupon code is required." });

  try {
    const coupon = await Coupon.findOne({ couponCode, isActive: true });
    if (!coupon)
      return res.status(404).json({ message: "Invalid or inactive coupon." });
    if (coupon.expiryDate < Date.now()) {
      coupon.isActive = false;
      await coupon.save({ validateBeforeSave: false });
      return res.status(404).json({
        success: false,
        data: coupon.isActive,
        message: "Coupon expired.",
      });
    }
    res.status(200).json({
      success: true,
      data: coupon.discountPercentage,
      message: "Coupon applied successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const addCoupon = async (req, res, next) => {
  const { name, couponCode, discountPercentage, expiryDate } = req.body;

  if (!name || !couponCode || !discountPercentage || !expiryDate)
    return res.status(400).json({ message: "Invalid data" });

  try {
    const coupon = new Coupon({
      name,
      couponCode,
      discountPercentage,
      expiryDate,
    });

    await coupon.save();

    res.status(201).json({
      success: true,
      data: coupon,
      message: "Coupon added successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const getAllOrdersByUser = async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) {
    return next(errorHandler(400, "Invalid data"));
  }
  try {
    const orders = await Order.find({ userId });
    let orderDetails = [];

    orders.map((order) => {
      let product = {
        thumbnail: null,
        title: null,
        price: null,
        quantity: null,
      };
      order?.items.map((item) => {
        product.thumbnail =
          item?.product.coverImage && item?.product.coverImage;
        product.title = item?.product.title;
        product.price = item?.product.price;
        product.quantity = item?.product.quantity;
      });
      orderDetails.push({
        orderId: order._id,
        totalAmount: order.totalAmount,
        product: product,
      });
    });

    res.status(200).json({
      success: true,
      data: orderDetails,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

// admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
