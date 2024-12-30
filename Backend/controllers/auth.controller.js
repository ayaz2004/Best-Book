import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorhandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const {
    username,
    email,
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
    next(errorhandler(400, "All fields are required except email"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
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
