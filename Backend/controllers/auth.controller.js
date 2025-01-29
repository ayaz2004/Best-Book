import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { sendOTP } from "../utils/Twilio.js";
import { setOTP, getOTP, deleteOTP } from "../utils/OTPStore.js";
import { v4 as uuidv4 } from "uuid";

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
    return next(errorHandler(400, "All fields are required."));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  newUser = {
    username,
    phoneNumber,
    password: hashedPassword,
    currentClass,
    targetExam,
    targetYear,
  };

  try {
    const otpResult = await sendOTP(phoneNumber);

    if (otpResult.otp) {
      setOTP(phoneNumber, otpResult.otp);
      return res.json({
        success: true,
        message: `OTP sent successfully to ${phoneNumber}`,
      });
    } else {
      return next(errorHandler(500, "Internal Server Error"));
    }
  } catch (error) {
    return next(errorHandler(500, "Internal Server Error"));
  }
};

export const verifyOTP = async (req, res, next) => {
  const { otp, phoneNumber } = req.body;

  if (!otp || otp === "" || !phoneNumber || phoneNumber === "") {
    return next(errorHandler(400, "OTP is required."));
  }

  const storedOTP = getOTP(phoneNumber);
  if (!storedOTP) {
    return next(errorHandler(400, "OTP expired. Please try again."));
  }
  if (storedOTP !== otp) {
    return next(errorHandler(400, "Invalid OTP"));
  }

  const user = new User(newUser);
  await user.save();

  // Clear OTP and user data from the temporary store
  deleteOTP(phoneNumber);
  newUser = null;

  res.json({
    message: "OTP verified successfully",
  });
};

export const signin = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password || username === "" || password === "") {
    return next(errorHandler(400, "All fields are required."));
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

    // Generate tokens
    const sessionId = uuidv4();
    const accessToken = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin, sessionId },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    const sessionToken = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin, sessionId },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    // Save the tokens in the user's record
    validUser.accessToken = accessToken;
    validUser.sessionToken = sessionToken;
    validUser.sessionId = sessionId;
    await validUser.save();

    const { password: pass, ...rest } = validUser._doc;
    console.log("rest", rest);
    res
      .status(200)
      .cookie("access_token", accessToken, {
        httpOnly: true,
      })
      .cookie("session_token", sessionToken, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
