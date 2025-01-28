import mongoose from "mongoose";
import { Schema } from "mongoose";
var reviews = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
    },
    
    itemType: {
      type: String,
      enum: ["Book", "Quiz"],
      required: true,
    },
    itemId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "itemType",
    },
    approved:{
      type: Boolean,
      default:false
    }
  },
  { timestamps: true }
);

const Reviews = mongoose.model("Reviews", reviews);
export default Reviews;
