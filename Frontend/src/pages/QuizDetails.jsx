import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  addToCartStart,
  addToCartSuccess,
  addToCartFailure,
} from "../redux/cart/cartSlice";
import {
  ChevronLeft,
  ShoppingCart,
  Clock,
  Award,
  CheckCircle,
  BookOpen,
  Star,
  BarChart3,
  HelpCircle,
  AlertCircle,
  Lock,
} from "lucide-react";

export default function QuizDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch quiz details and check access
  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        setLoading(true);
        // Fetch quiz details
        const response = await fetch(`/api/quizzes/quiz-details/${quizId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch quiz details");
        }
        const data = await response.json();
        setQuiz(data.quiz);

        // Check if user has access (only if user is logged in)
        if (currentUser) {
          setIsCheckingAccess(true);
          try {
            const accessResponse = await fetch(
              `/api/quizzes/check-access/${quizId}`,
              {
                headers: {
                  Authorization: `Bearer ${currentUser.token}`,
                },
              }
            );

            if (accessResponse.ok) {
              const accessData = await accessResponse.json();
              setHasAccess(accessData.hasAccess);
            }
          } catch (accessError) {
            console.error("Error checking access:", accessError);
          } finally {
            setIsCheckingAccess(false);
          }
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [quizId, currentUser]);

  const handleAddToCart = async () => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    if (addingToCart) return;

    dispatch(addToCartStart());
    setAddingToCart(true);

    try {
      const response = await fetch(`/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({
          itemId: quiz._id,
          itemType: "quiz",
          quantity: 1,
          price: quiz.discountPrice > 0 ? quiz.discountPrice : quiz.price,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(addToCartSuccess(data));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1500);
      } else {
        throw new Error(data.message || "Failed to add quiz to cart");
      }
    } catch (error) {
      dispatch(addToCartFailure(error.message));
    } finally {
      setAddingToCart(false);
    }
  };

  const handleStartQuiz = () => {
    navigate(`/quiz-attempt/${quizId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  // Error state
  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-800 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Quiz
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "Failed to load quiz details"}
          </p>
          <button
            onClick={() => navigate("/all-quizzes")}
            className="bg-gradient-to-r from-blue-700 to-purple-700 text-white px-6 py-3 rounded-xl hover:opacity-90"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  // Calculate difficulty level color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
          <CheckCircle className="h-5 w-5" />
          <span>Quiz added to cart successfully!</span>
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
            to="/all-quizzes"
            className="hover:text-purple-300 transition-colors"
          >
            Quizzes
          </Link>
          <span className="mx-2">/</span>
          <span className="text-purple-300">{quiz.title}</span>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Left Column - Quiz Info */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="lg:w-2/5 bg-gradient-to-br from-purple-100 to-blue-100 p-8"
            >
              {/* Quiz Header */}
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-800 to-purple-800 rounded-xl">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-blue-900">
                      {quiz.chapterId?.subject?.exam?.name || "Exam"}
                    </h3>
                    <p className="text-gray-600">
                      {quiz.chapterId?.subject?.name || "Subject"} /{" "}
                      {quiz.chapterId?.name || "Chapter"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quiz Stats */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  Quiz Statistics
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <HelpCircle className="h-5 w-5 text-blue-700 mr-2" />
                      <span className="text-gray-700">Questions</span>
                    </div>
                    <span className="font-semibold text-blue-900">
                      {quiz.questionCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-purple-700 mr-2" />
                      <span className="text-gray-700">Time Limit</span>
                    </div>
                    <span className="font-semibold text-blue-900">
                      {quiz.timeLimit} minutes
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-yellow-600 mr-2" />
                      <span className="text-gray-700">Passing Score</span>
                    </div>
                    <span className="font-semibold text-blue-900">
                      {quiz.passingScore}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BarChart3 className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-gray-700">Difficulty</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                        quiz.difficulty
                      )}`}
                    >
                      {quiz.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Difficulty Distribution */}
              {quiz.difficultyDistribution && (
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">
                    Question Difficulty
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-green-700">
                          Easy
                        </span>
                        <span className="text-sm font-medium text-green-700">
                          {quiz.difficultyDistribution.Easy}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${quiz.difficultyDistribution.Easy}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-yellow-700">
                          Medium
                        </span>
                        <span className="text-sm font-medium text-yellow-700">
                          {quiz.difficultyDistribution.Medium}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{
                            width: `${quiz.difficultyDistribution.Medium}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-red-700">
                          Hard
                        </span>
                        <span className="text-sm font-medium text-red-700">
                          {quiz.difficultyDistribution.Hard}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{
                            width: `${quiz.difficultyDistribution.Hard}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right Column - Quiz Details */}
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
                {quiz.title}
              </motion.h1>

              {/* Date created */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-gray-600 mb-6"
              >
                Created on {new Date(quiz.createdAt).toLocaleDateString()}
              </motion.p>
              {/* Pricing and Action Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-md mb-8"
              >
                {quiz.isFree ? (
                  <div>
                    <div className="flex items-center mb-4">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                      <h3 className="text-xl font-semibold text-blue-900">
                        Free Quiz
                      </h3>
                    </div>

                    <p className="text-gray-600 mb-6">
                      This quiz is available for free. Start now to test your
                      knowledge.
                    </p>

                    {currentUser ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleStartQuiz}
                        className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                        disabled={isCheckingAccess}
                      >
                        {isCheckingAccess ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        ) : (
                          <>Start Quiz Now</>
                        )}
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/sign-in")}
                        className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                      >
                        Sign In to Start Quiz
                      </motion.button>
                    )}
                  </div>
                ) : (
                  <div>
                    {hasAccess ? (
                      <div>
                        <div className="flex items-center mb-4">
                          <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                          <h3 className="text-xl font-semibold text-blue-900">
                            You have access to this quiz
                          </h3>
                        </div>

                        <p className="text-gray-600 mb-6">
                          You can take this quiz anytime. Good luck!
                        </p>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleStartQuiz}
                          className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                        >
                          Start Quiz Now
                        </motion.button>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-semibold text-blue-900 mb-4">
                          Premium Quiz
                        </h3>
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold text-purple-600">
                            ₹
                            {quiz.discountPrice > 0
                              ? quiz.discountPrice
                              : quiz.price}
                          </span>

                          {quiz.discountPrice > 0 && (
                            <>
                              <span className="ml-2 text-gray-500 line-through">
                                ₹{quiz.price}
                              </span>
                              <span className="ml-2 text-green-500">
                                ({quiz.discountPercentage}% off)
                              </span>
                            </>
                          )}
                        </div>

                        <div className="mt-6">
                          {currentUser ? (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleAddToCart}
                              disabled={addingToCart}
                              className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                            >
                              {addingToCart ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                              ) : (
                                <>
                                  <ShoppingCart className="mr-2 h-5 w-5" />
                                  Add to Cart
                                </>
                              )}
                            </motion.button>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => navigate("/sign-in")}
                              className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                            >
                              <Lock className="mr-2 h-5 w-5" />
                              Sign In to Purchase
                            </motion.button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Tabs */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="border-b border-gray-200 mb-8"
              >
                <div className="flex space-x-8">
                  {["Description", "Benefits", "Requirements"].map((tab) => (
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
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-gray-600 leading-relaxed"
                  >
                    <p>
                      {quiz.description ||
                        "No description available for this quiz."}
                    </p>

                    <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-blue-900 font-medium mb-2">
                        What you'll learn:
                      </h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Test your understanding of key concepts in{" "}
                          {quiz.chapterId?.subject?.name} /{" "}
                          {quiz.chapterId?.name}
                        </li>
                        <li>
                          Practice with {quiz.questionCount} carefully designed
                          questions
                        </li>
                        <li>Strengthen your knowledge for upcoming exams</li>
                        <li>Identify areas where you need more practice</li>
                      </ul>
                    </div>
                  </motion.div>
                )}

                {activeTab === "benefits" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-semibold text-blue-900">
                      Why take this quiz?
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center mb-2">
                          <Star className="h-5 w-5 text-yellow-500 mr-2" />
                          <h4 className="font-medium text-blue-800">
                            Exam Preparation
                          </h4>
                        </div>
                        <p className="text-gray-600 text-sm">
                          Prepare effectively for your exams with questions that
                          match the format and difficulty level.
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center mb-2">
                          <Star className="h-5 w-5 text-yellow-500 mr-2" />
                          <h4 className="font-medium text-blue-800">
                            Immediate Feedback
                          </h4>
                        </div>
                        <p className="text-gray-600 text-sm">
                          Get instant results and explanations to understand
                          where you need to improve.
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center mb-2">
                          <Star className="h-5 w-5 text-yellow-500 mr-2" />
                          <h4 className="font-medium text-blue-800">
                            Time Management
                          </h4>
                        </div>
                        <p className="text-gray-600 text-sm">
                          Practice answering questions within a time limit to
                          improve your speed and accuracy.
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center mb-2">
                          <Star className="h-5 w-5 text-yellow-500 mr-2" />
                          <h4 className="font-medium text-blue-800">
                            Targeted Learning
                          </h4>
                        </div>
                        <p className="text-gray-600 text-sm">
                          Focus on specific topics and chapters to strengthen
                          your weakest areas.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "requirements" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-xl font-semibold text-blue-900 mb-4">
                      Quiz Requirements
                    </h3>

                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          Basic understanding of {quiz.chapterId?.subject?.name}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          Familiarity with {quiz.chapterId?.name} concepts
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          Set aside {quiz.timeLimit} minutes of uninterrupted
                          time
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          A calculator may be helpful for some questions (if
                          applicable)
                        </span>
                      </li>
                    </ul>

                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-yellow-800 mb-1">
                            Important Note:
                          </h4>
                          <p className="text-yellow-700 text-sm">
                            Once you start the quiz, the timer will begin and
                            cannot be paused. Please ensure you have enough time
                            to complete the quiz in one sitting.
                          </p>
                        </div>
                      </div>
                    </div>
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
