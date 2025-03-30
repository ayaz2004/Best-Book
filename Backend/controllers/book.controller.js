import Book from "../models/book.model.js"; // Adjust the path as necessary
import User from "../models/user.model.js";
import {
  uploadImagesToCloudinary,
  uploadPdftoCloudinary,
} from "../utils/cloudinary.js";
import { errorHandler } from "../utils/error.js";
import Reviews from "../models/reviews.model.js";

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
    const bookImagesPath = req.files?.bookImages.map((image) => image.path);
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
      return next(
        errorHandler(
          400,
          "isEbookAvailable, coverPage, and targetExam are required."
        )
      );
    }
    const uploadResponse = await uploadImagesToCloudinary(coverImagePath);
    // Create new book instance
    const pdfUploadResponse = pdfPath && (await uploadPdftoCloudinary(pdfPath));

    const bookImagesUrls =
      bookImagesPath && (await uploadBookImages(bookImagesPath));

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
      images: bookImagesUrls && bookImagesUrls,
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
    console.error(error.message);
    next(errorHandler(500, "error in cnotroler")); // Pass error to the error-handling middleware
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

    if (req.files) {
      // Handle cover image update
      if (req.files.coverImage) {
        const coverImagePath = req.files.coverImage[0].path;
        const uploadResponse = await uploadImagesToCloudinary(coverImagePath);
        updateBookData.coverImage = uploadResponse.url;
      }

      // Handle eBook update
      if (req.files.eBook) {
        const pdfPath = req.files.eBook[0].path;
        const pdfUploadResponse = await uploadPdftoCloudinary(pdfPath);
        updateBookData.eBook = pdfUploadResponse.url;
      }

      // Handle book images update
      if (req.files.bookImages) {
        const bookImagesPath = req.files.bookImages.map((image) => image.path);
        const bookImagesUrls = await uploadBookImages(bookImagesPath);
        updateBookData.images = bookImagesUrls;
      }
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
    // Send success response
    // const BookResponse={};
    // for(const book of books){
    //   const reviews = await getAllReviewsForBook(book._id);

    // }

    // Get all approved reviews for these books
    const bookIds = books.map((book) => book._id);
    const allReviews = await Reviews.find({
      itemId: { $in: bookIds },
      itemType: "Book",
      approved: true,
    });

    // Group reviews by bookId
    const reviewsByBookId = {};
    allReviews.forEach((review) => {
      const bookId = review.itemId.toString();
      if (!reviewsByBookId[bookId]) {
        reviewsByBookId[bookId] = [];
      }
      reviewsByBookId[bookId].push(review);
    });

    // Add review stats to each book
    const booksWithReviews = books.map((book) => {
      const bookId = book._id.toString();
      const bookReviews = reviewsByBookId[bookId] || [];
      const reviewCount = bookReviews.length;

      let averageRating = 0;
      if (reviewCount > 0) {
        const totalRating = bookReviews.reduce(
          (sum, review) => sum + (review.rating || 0),
          0
        );
        averageRating = Number((totalRating / reviewCount).toFixed(1));
      }

      return {
        ...book._doc,
        reviewStats: {
          reviewCount,
          averageRating,
        },
      };
    });

    res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      books: booksWithReviews,
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

    // Get all approved reviews for this book
    const reviews = await Reviews.find({
      itemId: bookId,
      itemType: "Book",
      approved: true,
    });

    // Calculate average rating and count
    const reviewCount = reviews.length;
    let averageRating = 0;

    if (reviewCount > 0) {
      const totalRating = reviews.reduce(
        (sum, review) => sum + (review.rating || 0),
        0
      );
      averageRating = Number((totalRating / reviewCount).toFixed(1));
    }

    res.status(200).json({
      success: true,
      message: "Book fetched successfully",
      book,
      reviewStats: {
        reviewCount,
        averageRating,
      },
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
  if (!exam || exam === "") {
    return next(errorHandler(400, "Exam is required"));
  }
  try {
    if (exam === "all") {
      console.log(exam);
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

// getting recently added 3 three books
export const getRecentlyAddedBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);
    res.status(200).json({
      success: true,
      message: "Recently added books fetched successfully",
      books,
    });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, error.message));
  }
};
export const getPurchasedEbooks = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate("subscribedEbook");
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const ebooks = [];

    for (const ebook of user.subscribedEbook) {
      const purchasedBook = await Book.findById(ebook);
      if (!purchasedBook) {
        return next(errorHandler(500, "No Book Found"));
      }

      ebooks.push(purchasedBook);
    }

    res.status(200).json({
      success: true,
      message: "Purchased ebooks fetched successfully",
      ebooks,
    });
  } catch (error) {
    console.error(error.message);
    next(errorHandler(500, error.message));
  }
};

const uploadBookImages = async (imagePaths) => {
  try {
    // Map each image path to a upload promise
    const uploadPromises = imagePaths.map((path) =>
      uploadImagesToCloudinary(path)
    );
    // Wait for all uploads to complete
    const uploadResults = await Promise.all(uploadPromises);
    // Return array of uploaded image URLs
    return uploadResults.map((result) => result.url);
  } catch (error) {
    throw new Error(`Error uploading book images: ${error.message}`);
  }
};

const getAllReviewsForBook = async (bookId) => {
  const reviews = await Reviews.findById({ itemId: bookId, approved: true });
  if (!reviews) {
    return null;
  }
  const approvedReviews = {
    review: [],
    rating: -1,
  };
  const rate = 0.0;
  for (const rev of reviews) {
    approvedReviews.review.push(rev);
    rate += rev.rating;
  }

  rate = Math.floor(rate / reviews.language);
  approvedReviews.rating = rate;
  return approvedReviews;
};
