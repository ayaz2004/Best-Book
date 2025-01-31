import mongoose from "mongoose";
import {
  AvailableOrderStatuses,
  AvailablePaymentProviders,
  OrderStatusEnum,
  PaymentProviderEnum,
} from "../utils/constant.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import Address from "./address.model.js";
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
    shippingAddress: {type:Address.schema, required: true},

    paymentProvider: {
      type: String,
      enum: AvailablePaymentProviders,
      default: PaymentProviderEnum.COD,
      required: true,
    },
    isPaymentDone: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

orderSchema.plugin(mongooseAggregatePaginate);
const Order = mongoose.model("Order", orderSchema);
export { Order };


// addres1
// addres2 
//  new 