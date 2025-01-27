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

export const placeOrder = async (req, res, next) => {
  const { userId, cartId, address } = req.body;

  try {
    if (!userId || !cartId || !address) {
      return next(errorHandler(400, "Invalid data"));
    }

    const cartItems = await Cart.findById(cartId);

    // if(req.user._id !== userId){
    //     return next(errorHandler(403, "Unauthorized"));
    // }

    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    let totalPrice = 0;
    let validateItems = [];
    console.log(cartItems);
    for (const item of cartItems?.items) {
      if (!item.productId || !item.quantity) {
        return next(errorHandler(400, "Invalid data"));
      }

      if (item.quantity <= 0) {
        return next(errorHandler(400, "Invalid quantity"));
      }

      const product =
        item.productType === "Book"
          ? await Book.findById(item.productId)
          : await Quiz.findById(item.productId);
      if (!product) {
        return next(errorHandler(404, "Product not found"));
      }

      if (product.stock < item.quantity) {
        return next(errorHandler(400, "Insufficient stock"));
      }

      product.stock -= item.quantity;
      await product.save({ validateBeforeSave: false });

      totalPrice += product.price * item.quantity; // + delivery charged
      validateItems.push({ product, quantity: item.quantity });
    }

    const order = new Order({
      userId,
      items: validateItems,
      totalAmount: totalPrice,
      address,
      paymentProvider: PaymentProviderEnum.COD,
    });

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
