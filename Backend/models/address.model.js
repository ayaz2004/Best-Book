import mongoose from "mongoose";
import { errorHandler } from "../utils/error.js";
import { validate } from "uuid";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address1: {
      type: String,
      required: true,
    },
    address2: String,
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: "India",
    },
    maxAddress:{
      type:Number,
      required:true,
      max:3,
      default:1
    }
  },
  { timestamps: true }
);

addressSchema.pre("save", async function (next) {
  const addressCount = await Address.countDocuments({
    userId: this.userId,
  });

  if (addressCount >= 3) {
    return next(new Error("Maximum address limit reached (3 addresses allowed)."));
  }

  next();
});

const Address = mongoose.model("Address", addressSchema);
export default Address
