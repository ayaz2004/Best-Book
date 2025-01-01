import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorhandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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
    next(errorhandler(400, "All fields are required."));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    phoneNumber,
    password: hashedPassword,
    currentClass,
    targetExam,
    targetYear,
  });

  try {
    await newUser.save();
    res.json("Sign Up successful");
  } catch (error) {
    next(error);
  }
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
