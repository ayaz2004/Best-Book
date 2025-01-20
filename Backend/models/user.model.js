import mongoose from "mongoose";
import { Schema } from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    currentClass: {
      type: String,
      required: true,
    },
    targetExam: {
      type: [String],
      required: true,
    },
    targetYear: {
      type: [String],
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    subscribedEbook: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    currentToken: {
      type: String,
      default: null,
    },
    sessionToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
