import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "./error.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  const sessionToken = req.cookies.session_token;
  if (!token || !sessionToken) {
    return next(errorHandler(401, "Unauthorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (
      !user ||
      user.currentToken !== token ||
      user.sessionToken !== sessionToken
    ) {
      return next(errorHandler(403, "Invalid token."));
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(errorHandler(400, "Invalid token."));
  }
};
