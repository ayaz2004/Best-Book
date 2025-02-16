import { errorHandler } from "../utils/error.js";
import { Order } from "../models/orders.model.js";
import {
  OrderStatusEnum,
  AvailableOrderStatuses,
  PaymentProviderEnum,
} from "../utils/constant.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Book from "../models/book.model.js";
import { Quiz } from "../models/quiz.model.js";
import { Cart } from "../models/cart.model.js";
import Address from "../models/address.model.js";
import { Coupon } from "../models/coupon.model.js";
import { validate } from "uuid";
import axios from "axios";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

import dotenv from "dotenv";
dotenv.config();

// ----- PhonePe Configurations -----
const MERCHANT_KEY = process.env.MERCHANT_KEY;
const MERCHANT_ID = process.env.MERCHANT_ID;
const MERCHANT_BASE_URL = process.env.MERCHANT_BASE_URL;
const MERCHANT_STATUS_URL = process.env.MERCHANT_STATUS_URL;
const redirectUrl = process.env.REDIRECT_URL;
const successUrl = process.env.SUCCESS_URL;
const failureUrl = process.env.FAILURE_URL;

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
    if (!userId  || !shippingAddress || !totalAmount || paymentProvider === "" || isPaymentDone === null || isPaymentDone === undefined) {
      return next(errorHandler(400, "Invalid data"));
    }

 
    if(req.user.id !== userId){
        return next(errorHandler(403, "Unauthorized"));
    }

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
        subscribedEbook.push(item.product._id);
     
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

    const order = new Order({
      userId,
      username: user.username,
      items: validateItems,
      totalAmount,
      shippingAddress: shippingAddress,
      paymentProvider: paymentProvider,
      isPaymentDone,
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

// ----- PhonePe Payment Gateway: Initiate Payment -----
export const initiatePhonepePayment = async (req, res, next) => {
  const { name, mobileNumber, totalAmount, userId } = req.body;
  const orderId = uuidv4(); // Create a unique transaction ID
  const paymentPayload = {
    merchantId: MERCHANT_ID,
    merchantUserId: name,
    mobileNumber: mobileNumber,
    amount: totalAmount * 100, // Amount in paise
    merchantTransactionId: orderId,
    redirectUrl: `${redirectUrl}`,
    redirectMode: "POST",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const payloadString = Buffer.from(JSON.stringify(paymentPayload)).toString(
    "base64"
  );
  const keyIndex = 1;
  const stringToHash = payloadString + "/pg/v1/pay" + MERCHANT_KEY;
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
  const checksum = sha256 + "###" + keyIndex;

  const options = {
    method: "POST",
    url: MERCHANT_BASE_URL,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
    },
    data: {
      request: payloadString,
    },
  };

  try {
    const response = await axios(options);
    const redirectLink = response.data.data.instrumentResponse.redirectInfo.url;
    // You may want to store payment details and mark order as pending here.
    res.status(200).json({ msg: "OK", redirectUrl: redirectLink, orderId });
  } catch (error) {
    console.error("Error initiating payment", error);
    next(errorHandler(500, "Failed to initiate payment"));
  }
};

// ----- PhonePe Payment Gateway: Payment Status Callback -----
export const phonepeStatusCallback = async (req, res, next) => {
  const merchantTransactionId = req.query.id;
  const keyIndex = 1;
  const stringToHash =
    `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + MERCHANT_KEY;
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
  const checksum = sha256 + "###" + keyIndex;

  const options = {
    method: "GET",
    url: `${MERCHANT_STATUS_URL}/${MERCHANT_ID}/${merchantTransactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": MERCHANT_ID,
    },
  };

  try {
    const response = await axios(options);
    if (response.data.success === true) {
      // You can update the corresponding order status to "Paid" here.
      return res.redirect(successUrl);
    } else {
      return res.redirect(failureUrl);
    }
  } catch (error) {
    console.error("Error fetching payment status", error);
    next(errorHandler(500, "Failed to fetch payment status"));
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
      message: "Coupon applied successfully",
      data: coupon.discountPercentage,
      couponCode: coupon.couponCode,
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
  const  userId  = req.user.id;

  if (!userId) {
    return next(errorHandler(400, "Invalid data"));
  }
  try {
    const orders = await Order.find({ userId });
    let orderDetails = [];

    orders.map((order) => {
      let product = {
        coverImage: null,
        title: null,
        price: null,
        quantity: null,
      };
      order?.items.map((item) => {
        product.coverImage =
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
