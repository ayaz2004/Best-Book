import mongoose, { Schema } from "mongoose";


const cartSchema = new Schema(
  {
    belongTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    items: {
      type: [
        {
          productId: {
            type: String
          },
          quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity can not be less then 1."],
            default: 1,
          },
        },
      ],
      default: [],
    },
    // coupon: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Coupon",
    //   default: null,
    // },
  },

  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);
