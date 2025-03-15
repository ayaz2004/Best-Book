import aj from "../utils/arcjet.js";
import { errorHandler } from "../utils/error.js";

const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit())
        next(errorHandler(429, "Too many requests"));
      else if (decision.reason.isBot())
        next(errorHandler(403, "Bots are not allowed"));
      else next(errorHandler(403, "Forbidden"));
    }
    next();
  } catch (error) {
    next(errorHandler(500, "Internal Server Error"));   
  }
};

export default arcjetMiddleware;