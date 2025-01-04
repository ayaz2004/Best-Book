import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorhandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { sendOTP } from "../utils/Twilio.js";

let OTP = "";
let newUser = null;

export const signup = async (req, res, next) => {
  const {
    username,
    phoneNumber,
    password,
    currentClass,
    targetExam,
    targetYear,
  } = req.body;
  console.log(req.body);
  if (
    !username ||
    !phoneNumber ||
    !password ||
    !currentClass ||
    !targetExam ||
    !targetYear ||
    username === "" ||
    phoneNumber === "" ||
    password === "" ||
    currentClass === "" ||
    targetExam === "" ||
    targetYear === ""
  ) {
    next(errorhandler(400, "All fields are required."));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  newUser = new User({
    username,
    phoneNumber,
    password: hashedPassword,
    currentClass,
    targetExam,
    targetYear,
  });

  try {
    console.log("Sign Up successful");

    const otpResult = await sendOTP(phoneNumber); // Get OTP from sendOTP function
    if (otpResult.otp) {
      OTP = otpResult.otp;
      res.json(`OTP sent successfully to ${phoneNumber}`);
      await newUser.save();
    } else {
      next(errorhandler(500, "Internal Server Error"));
    }
  } catch (error) {
    next(error);
  }
};
export const verifyOTP = async (req, res, next) => {
  const { otp } = req.body;
  console.log(req.body);
  if (!otp || otp === "") {
    return next(errorhandler(400, "OTP is required."));
  }
  if (otp !== OTP) {
    return next(errorhandler(400, "Invalid OTP"));
  }

  newUser.save();
  res.json({ message: "OTP verified successfully" });
};

export const signin = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password || username === "" || password === "") {
    next(errorhandler(400, "All fields are required."));
  }

  try {
    const validUser = await User.findOne({ username });
    if (!validUser) {
      return next(errorhandler(404, "Wrong Credentials"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorhandler(400, "Wrong Credentials"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
