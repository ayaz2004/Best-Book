import mongoose, { Schema } from "mongoose";

import {AvailableCouponTypes,CouponTypeEnum} from '../utils/constant.js'
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const couponSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    couponCode: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: AvailableCouponTypes,
      default: CouponTypeEnum.FLAT,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    minimumCartValue: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

couponSchema.plugin(mongooseAggregatePaginate);

export const Coupon = mongoose.model("Coupon", couponSchema);
