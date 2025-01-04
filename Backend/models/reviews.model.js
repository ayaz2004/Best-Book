import mongoose from "mongoose";
import { Schema } from "mongoose";
var reviews = new Schema(
  {
    userid: {
      type: Schema.Types.ObjectId,
    },
    description: {
      type: String,
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
  },
  { timeseries: true }
);

const Reviews = mongoose.model("Reviews", reviews);
export default Reviews;
