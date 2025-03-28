import mongoose from "mongoose";
import { Schema } from "mongoose";

var BookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    targetExam: {
      type: String,
      required: true,
    },
    ebookDiscount: {
      type: Number,
      default: 0,
    },
    isEbookAvailable: {
      type: Boolean,
      required: true,
    },
    hardcopyDiscount: {
      type: Number,
      default: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    eBook: {
      type: String,
    },
    author: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    publicationDate: {
      type: Date,
      required: true,
    },
    ISBN: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    /**
     * @deprecated Since version 2.0.0
     * This field is deprecated and will be removed in a future version.
     * Use the reviewStats.averageRating from book.controller.js instead.
     */
    rating: {
      type: Number,
      default: 0,
    },

    language: {
      type: String,
      required: true,
    },
    pages: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      // required: true,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", BookSchema);
export default Book;
