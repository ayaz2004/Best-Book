import mongoose from "mongoose";
import { Schema } from "mongoose";
var BookSchema = new Schema(
  {
    stock: {
      type: Number,
      // required: true,
    },
    ebookDiscount: {
      type: Number,
      default: 0,
    },
    isEbookAvailable: {
      type: Boolean,
      required: true,
    },
    price: {
      type: Number,
      // required: true,
    },
    hardcopyDiscount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      // required: true,
    },
    title: {
      type: String,
      // required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    eBook: {
      type: String,
    },
    coverImage: {
      type: String,
      required: true,
    },
    targetExam: {
      type: String,
      required: true,
    },
    // u can find totl number of reviews by reviewsIdSize
    reviewsId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reviews",
      },
    ],
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", BookSchema);
export default Book;
