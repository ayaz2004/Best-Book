import Book from "../models/book.model.js"; // Adjust the path as necessary
import {
  uploadImagesToCloudinary,
  uploadPdftoCloudinary,
} from "../utils/cloudinary.js";
import { errorHandler } from "../utils/error.js";

export const uploadBooks = async (req, res, next) => {
  try {
    // Destructure book details from the request body
    const {
      stock,
      ebookDiscount,
      isEbookAvailable,
      price,
      hardcopyDiscount,
      description,
      title,
      targetExam,
      author,
      publisher,
      publicationDate,
      ISBN,
      category,
      language,
      pages,
    } = req.body;
    const coverImagePath = req.files?.coverImage[0]?.path;
    const pdfPath = req.files?.eBook[0]?.path;
    // Validate required fields
    if (
      !isEbookAvailable ||
      !coverImagePath ||
      !targetExam ||
      !stock ||
      !price ||
      !hardcopyDiscount ||
      !title
    ) {
      return res.status(400).json({
        message: "isEbookAvailable, coverPage, and targetExam are required.",
      });
    }
    const uploadResponse = await uploadImagesToCloudinary(coverImagePath);
    // Create new book instance
    const pdfUploadResponse = pdfPath && (await uploadPdftoCloudinary(pdfPath));

    const newBook = new Book({
      stock,
      ebookDiscount,
      isEbookAvailable,
      price,
      hardcopyDiscount,
      description,
      coverImage: uploadResponse.url && uploadResponse.url,
      title,
      eBook: pdfUploadResponse.url && pdfUploadResponse.url,
      targetExam,
      author,
      publisher,
      publicationDate,
      ISBN,
      category,
      language,
      pages,
    });

    // Save the book to the database
    await newBook.save();

    // Send success response
    res.status(201).json({
      success: true,
      message: "Book uploaded successfully",
      book: newBook,
    });
  } catch (error) {
    console.error(error);
    next(error); // Pass error to the error-handling middleware
  }
};

export const deleteBook = async (req, res, next) => {
  const { bookId } = req.params;
  if (!bookId) {
    return next(errorHandler(400, "Book ID is required"));
  }

  try {
    const book = await Book.findByIdAndDelete(bookId);
    if (!book) {
      return next(errorHandler(404, "Book not found"));
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    next(errorHandler(500, error.message));
  }
};

export const updateBook = async (req, res, next) => {
  const { bookId } = req.params;

  const updateBookData = req.body;
  if (!bookId) {
    return next(errorHandler(400, "Book ID is required"));
  }

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return next(errorHandler(404, "Book not found"));
    }

    await Object.assign(book, updateBookData);

    await book.save({ validateModifiedOnly: true });

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    console.log(error.message);
    next(errorHandler(500, error.message));
  }
};

export const getBooks = async (req, res, next) => {
  try {
    // Fetch all books from the database
    const books = await Book.find();
    console.log(req.user);
    // Send success response
    res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      books,
    });
  } catch (error) {
    console.error(error);
    next(error); // Pass error to the error-handling middleware
  }
};

export const getBookById = async (req, res, next) => {
  const { bookId } = req.params;
  if (!bookId) {
    return next(errorHandler(400, "Book ID is required"));
  }

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return next(errorHandler(404, "Book not found"));
    }

    res.status(200).json({
      success: true,
      message: "Book fetched successfully",
      book,
    });
  } catch (error) {
    console.log(error.message);
    next(errorHandler(500, error.message));
  }
};

// Fetch popular books (example: based on stock or any other criteria)
export const getPopularBooks = async (req, res, next) => {
  try {
    // Fetch books sorted by stock in descending order as an example
    const books = await Book.find().sort({ stock: -1 }).limit(10);

    res.status(200).json({
      success: true,
      message: "Popular books fetched successfully",
      books,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// fetch book by exam

export const getAllBooksByExams = async (req, res, next) => {
  let { exam } = req.params;
  let books = null;
  if(!exam || exam === ""){
    return next(errorHandler(400, "Exam is required"));
  }
  try {
    if (exam === "all") {
      console.log(exam)
      books = await Book.find();
    } else {
      books = await Book.find({ targetExam: exam });
    }
    if (!books.length) {
      return next(errorHandler(404, "Books not found"));
    }
    res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      books,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
