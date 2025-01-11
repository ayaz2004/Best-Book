import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { sendOTP } from "../utils/Twilio.js";

const OTP_STORE = {};
let newUser = null;
let OTP = null;
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
    next(errorHandler(400, "All fields are required."));
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
      OTP_STORE[phoneNumber] = otpResult.otp;
      OTP_STORE[`${phoneNumber}_user`] = {
        username,
        phoneNumber,
        password: hashedPassword,
        currentClass,
        targetExam,
        targetYear,
      };
      OTP = otpResult.otp;
      console.log(OTP);
     return res.json({success:true,message:`OTP sent successfully to ${phoneNumber}`});

      await newUser.save();
    } else {
      next(errorHandler(500, "Internal Server Error"));
      return res.json({ success: false, message: "Internal Server Error" });
    }
  } catch (error) {
    // return next(error);
  }
};
export const verifyOTP = async (req, res, next) => {
  const { otp,phoneNumber } = req.body;
  console.log(req.body);
  if (!otp || otp === "" || !phoneNumber || phoneNumber === "") {
    return next(errorHandler(400, "OTP is required."));
  }
  if (!OTP_STORE[phoneNumber]) {
    return next(errorHandler(400, "Invalid OTP"));
  }
  console.log(OTP_STORE[phoneNumber]);
  if(OTP_STORE[phoneNumber] !== otp){
    return next(errorHandler(400, "Invalid OTP"));
  }
  const userData = OTP_STORE[`${phoneNumber}_user`];
  if (!userData) {
    return next(errorHandler(400, "User data not found. Please register again."));
  }

  const user = new User(userData);
  await user.save();

  // Clear OTP and user data from the temporary store
  delete OTP_STORE[phoneNumber];
  delete OTP_STORE[`${phoneNumber}_user`];
  res.json({ message: "OTP verified successfully" });
};

export const signin = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password || username === "" || password === "") {
    next(errorHandler(400, "All fields are required."));
  }

  try {
    const validUser = await User.findOne({ username });
    if (!validUser) {
      return next(errorHandler(404, "Wrong Credentials"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Wrong Credentials"));
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );
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
