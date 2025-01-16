import mongoose from "mongoose";
import {
  AvailableOrderStatuses,
  AvailablePaymentProviders,
  OrderStatusEnum,
  PaymentProviderEnum,
} from "../utils/constant.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const addressSchema = new mongoose.Schema({
    addressLine1: {
        required: true,
        type: String,
      },
      addressLine2: {
        type: String,
      },
      city: {
        required: true,
        type: String,
      },
      country: {
        required: true,
        type: String,
      },
      pincode: {
        required: true,
        type: String,
      },
      state: {
        required: true,
        type: String,
      },
})

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
      type: String,
      enum: AvailableOrderStatuses,
      default: OrderStatusEnum.PENDING,
    },
    address: {
    addressSchema,
    },
    paymentProvider: {
      type: String,
      enum: AvailablePaymentProviders,
      default: PaymentProviderEnum.UNKNOWN,
      required: true,
    },
    isPaymentDone: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

orderSchema.plugin(mongooseAggregatePaginate)
const Order = mongoose.model("Order", orderSchema);
export { Order };