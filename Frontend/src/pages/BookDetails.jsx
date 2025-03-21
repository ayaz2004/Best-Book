import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaShoppingCart,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  addToCartStart,
  addToCartSuccess,
  addToCartFailure,
} from "../redux/cart/cartSlice";
import BookReviewSection from "../components/BookReviewSection";

export default function BookDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMainCover, setShowMainCover] = useState(true);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    reviewCount: 0,
  });
  const [reviews, setReviews] = useState([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/book/getbookbyid/${bookId}`);
        if (!response.ok) throw new Error("Failed to fetch book details.");
        const data = await response.json();
        setBook(data.book);
        setReviewStats(data.reviewStats);

        // Fetch reviews separately - no auth needed for viewing
        setIsReviewsLoading(true);
        const reviewsResponse = await fetch(`/api/reviews/book/${bookId}`);
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData.reviews || []);
        }
        setIsReviewsLoading(false);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setIsReviewsLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  if (!book) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  const discountedEbookPrice = book.isEbookAvailable
    ? book.price - (book.price * book.ebookDiscount) / 100
    : null;
  const discountedHardcopyPrice =
    book.price - (book.price * book.hardcopyDiscount) / 100;

  const handleAddToCart = async (type) => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    dispatch(addToCartStart());
    try {
      const response = await fetch(`/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({
          productId: book._id,
          quantity: 1,
          bookType: type, // 'ebook' or 'hardcopy'
        }),
      });
      const data = await response.json();

      if (response.ok) {
        dispatch(addToCartSuccess(data));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1500); // Hide the message after 1.5 seconds
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      dispatch(addToCartFailure(error.message));
    }
  };

  // Handle navigation between images
  const nextImage = () => {
    if (book.images && book.images.length > 0) {
      if (showMainCover) {
        setShowMainCover(false);
        setCurrentImageIndex(0);
      } else {
        setCurrentImageIndex((prev) =>
          prev === book.images.length - 1 ? 0 : prev + 1
        );
      }
    }
  };

  const prevImage = () => {
    if (book.images && book.images.length > 0) {
      if (!showMainCover && currentImageIndex === 0) {
        setShowMainCover(true);
      } else if (!showMainCover) {
        setCurrentImageIndex((prev) =>
          prev === 0 ? book.images.length - 1 : prev - 1
        );
      }
    }
  };

  // Calculate the stars for rating display
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`w-5 h-5 ${
              i < fullStars
                ? "text-yellow-400"
                : i === fullStars && hasHalfStar
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-800 py-12"
    >
      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
        >
          <span>Product added to cart successfully!</span>
        </motion.div>
      )}

      {/* Content Container */}
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center text-sm text-white mb-8"
        >
          <Link to="/" className="hover:text-purple-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            to="/all-books"
            className="hover:text-purple-300 transition-colors"
          >
            Books
          </Link>
          <span className="mx-2">/</span>
          <span className="text-purple-300">{book.title}</span>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Left Column - Image Gallery */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="lg:w-2/5 bg-gradient-to-br from-purple-100 to-blue-100 p-8"
            >
              {/* Image Display - Fixed Size */}
              <div className="relative w-full h-[500px] rounded-xl overflow-hidden bg-white shadow-lg mb-6">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full flex items-center justify-center bg-gray-50"
                >
                  <img
                    src={
                      showMainCover
                        ? book.coverImage
                        : book.images[currentImageIndex]
                    }
                    alt={
                      showMainCover
                        ? `${book.title} cover`
                        : `Book image ${currentImageIndex + 1}`
                    }
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.target.src = book.coverImage;
                    }}
                  />
                </motion.div>
              </div>

              {/* Image Navigation Controls */}
              <div className="flex justify-between items-center mb-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevImage}
                  className="p-2 rounded-full bg-white shadow-md hover:bg-purple-50"
                  disabled={!book.images || book.images.length === 0}
                >
                  <FaArrowLeft className="w-6 h-6 text-blue-800" />
                </motion.button>
                <span className="text-blue-800 font-medium">
                  {!book.images || book.images.length === 0
                    ? "Cover Image"
                    : showMainCover
                    ? "Cover Image"
                    : `Image ${currentImageIndex + 1} of ${book.images.length}`}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextImage}
                  className="p-2 rounded-full bg-white shadow-md hover:bg-purple-50"
                  disabled={!book.images || book.images.length === 0}
                >
                  <FaArrowRight className="w-6 h-6 text-blue-800" />
                </motion.button>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-6 gap-2 mt-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMainCover(true)}
                  className={`aspect-square rounded-md overflow-hidden border-2 relative bg-white ${
                    showMainCover ? "border-blue-600" : "border-transparent"
                  }`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={book.coverImage}
                      alt="Cover"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </motion.div>

                {book.images &&
                  book.images.slice(0, 5).map((img, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowMainCover(false);
                        setCurrentImageIndex(idx);
                      }}
                      className={`aspect-square rounded-md overflow-hidden border-2 relative bg-white ${
                        !showMainCover && currentImageIndex === idx
                          ? "border-blue-600"
                          : "border-transparent"
                      }`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            e.target.src = book.coverImage;
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
              </div>

              {/* Action Buttons
              <div className="flex justify-center space-x-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full bg-white shadow hover:shadow-lg transition-all"
                >
                  <FaHeart className="w-6 h-6 text-red-500" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full bg-white shadow hover:shadow-lg transition-all"
                >
                  <FaShare className="w-6 h-6 text-blue-500" />
                </motion.button>
              </div> */}
            </motion.div>

            {/* Right Column - Book Details */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="lg:w-3/5 p-8"
            >
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-4xl font-bold text-blue-900 mb-4"
              >
                {book.title}
              </motion.h1>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center mb-6"
              >
                {renderStars(reviewStats.averageRating)}
                <span className="ml-2 text-gray-600">
                  ({reviewStats.averageRating}/5) • {reviewStats.reviewCount}{" "}
                  reviews
                </span>
              </motion.div>

              {/* Pricing Cards */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="grid md:grid-cols-2 gap-6 mb-8"
              >
                {book.isEbookAvailable && (
                  <motion.div
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                    className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-xl shadow-md"
                  >
                    <h3 className="text-xl font-semibold mb-2 text-blue-900">
                      E-Book Version
                    </h3>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-purple-600">
                        ₹{discountedEbookPrice.toFixed(2)}
                      </span>
                      <span className="ml-2 text-gray-500 line-through">
                        ₹{book.price}
                      </span>
                      <span className="ml-2 text-green-500">
                        ({book.ebookDiscount}% off)
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCart("ebook")}
                      className="mt-4 w-full bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                    >
                      <FaShoppingCart className="mr-2" />
                      Add to Cart
                    </motion.button>
                  </motion.div>
                )}

                <motion.div
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                  className="bg-gradient-to-br from-purple-100 to-blue-100 p-6 rounded-xl shadow-md"
                >
                  <h3 className="text-xl font-semibold mb-2 text-blue-900">
                    Hardcopy Version
                  </h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-purple-600">
                      ₹{discountedHardcopyPrice.toFixed(2)}
                    </span>
                    <span className="ml-2 text-gray-500 line-through">
                      ₹{book.price}
                    </span>
                    <span className="ml-2 text-green-500">
                      ({book.hardcopyDiscount}% off)
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddToCart("Book")}
                    className="mt-4 w-full bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                  >
                    <FaShoppingCart className="mr-2" />
                    Add to Cart
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Tabs */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="border-b border-gray-200 mb-8"
              >
                <div className="flex space-x-8">
                  {["Description", "Details", "Reviews"].map((tab) => (
                    <motion.button
                      key={tab}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`py-4 text-sm font-medium transition-colors hover:text-purple-600 ${
                        activeTab === tab.toLowerCase()
                          ? "text-purple-600 border-b-2 border-purple-600"
                          : "text-gray-500"
                      }`}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                    >
                      {tab}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === "description" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-gray-600 leading-relaxed"
                  >
                    {book.description}
                  </motion.p>
                )}

                {activeTab === "details" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-gray-600">Author</div>
                      <div className="font-medium">{book.author}</div>
                      <div className="text-gray-600">Publisher</div>
                      <div className="font-medium">{book.publisher}</div>
                      <div className="text-gray-600">ISBN</div>
                      <div className="font-medium">{book.ISBN}</div>
                      <div className="text-gray-600">Language</div>
                      <div className="font-medium">{book.language}</div>
                      <div className="text-gray-600">Pages</div>
                      <div className="font-medium">{book.pages}</div>
                      <div className="text-gray-600">Publication Date</div>
                      <div className="font-medium">
                        {new Date(book.publicationDate).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "reviews" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {isReviewsLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
                      </div>
                    ) : (
                      <>
                        {/* Show reviews to everyone */}
                        <BookReviewSection
                          bookId={book._id}
                          reviews={reviews}
                          canAddReview={!!currentUser}
                        />

                        {/* Prompt to login if not logged in */}
                        {!currentUser && reviews.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 bg-blue-50 rounded-lg text-center"
                          >
                            <p className="text-blue-800 mb-2">
                              Want to add your review?
                            </p>
                            <button
                              onClick={() => navigate("/sign-in")}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Sign in to review
                            </button>
                          </motion.div>
                        )}
                      </>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
