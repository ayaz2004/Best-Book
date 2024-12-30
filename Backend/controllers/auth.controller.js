import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
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
    return res.status(400).json({
      message: "All fields are required except Email(Email is optional)",
    });
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
    res.status(500).json({ message: error.message });
  }
};
