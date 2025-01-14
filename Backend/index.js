import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js"; // We can change name as userRouter as we have exported as default.
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import bookRoutes from "./routes/book.route.js";
import reviewRoutes from "./routes/reviews.routes.js";
import examRoutes from "./routes/exam.route.js";
import subjectRoutes from "./routes/subject.route.js";
import chapterRoutes from "./routes/chapter.route.js";
import quizRoutes from  "./routes/quiz.routes.js"
import cartRoutes from "./routes/cart.route.js";
import bodyParser from "body-parser";
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB!!");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static("public"));
app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/reviews", reviewRoutes);

// following routes are for quiz and ther calling is nested as per there downward order
app.use("/api/exams", examRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/quizzes", quizRoutes);
// cart
app.use("/api/cart", cartRoutes);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
