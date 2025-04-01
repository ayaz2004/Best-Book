import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "../utils/Anim/ScrollAnim";
import {
  Search,
  Clock3,
  BookOpen,
  Brain,
  Filter,
  Award,
  SlidersHorizontal,
  CheckCircle,
  X,
} from "lucide-react";

export default function AllQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState([]);

  // For subject filter - will be populated from quiz data
  const [availableSubjects, setAvailableSubjects] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/quizzes/getallquizzes");
        if (!response.ok) throw new Error("Failed to fetch quizzes");
        const data = await response.json();

        if (data.success && data.quizzes) {
          setQuizzes(data.quizzes);
          setFilteredQuizzes(data.quizzes);

          // Extract unique subjects for filter
          const subjects = [
            ...new Set(
              data.quizzes.map(
                (quiz) => quiz.chapterId?.subject?.name || "Uncategorized"
              )
            ),
          ];
          setAvailableSubjects(subjects);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // Apply filters whenever filter states change
  useEffect(() => {
    let result = [...quizzes];

    // Apply search filter
    if (searchTerm) {
      result = result.filter((quiz) =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply difficulty filter
    if (selectedDifficulty.length > 0) {
      result = result.filter((quiz) => {
        const difficulty = getDifficultyLabel(quiz.questions?.length || 0);
        return selectedDifficulty.includes(difficulty);
      });
    }

    // Apply subject filter
    if (selectedSubjects.length > 0) {
      result = result.filter((quiz) =>
        selectedSubjects.includes(
          quiz.chapterId?.subject?.name || "Uncategorized"
        )
      );
    }

    // Apply duration filter
    if (selectedDuration.length > 0) {
      result = result.filter((quiz) => {
        const duration = getTimeDuration(quiz.timeLimit || 0);
        return selectedDuration.includes(duration);
      });
    }

    setFilteredQuizzes(result);
  }, [
    searchTerm,
    selectedDifficulty,
    selectedSubjects,
    selectedDuration,
    quizzes,
  ]);

  // Get difficulty label based on question count
  function getDifficultyLabel(questionCount) {
    if (questionCount < 10) return "Easy";
    if (questionCount < 20) return "Moderate";
    return "Advanced";
  }

  // Get difficulty color
  function getDifficultyColor(questionCount) {
    if (questionCount < 10) return "bg-green-100 text-green-800";
    if (questionCount < 20) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  }

  // Get time duration category
  function getTimeDuration(minutes) {
    if (minutes <= 15) return "Short";
    if (minutes <= 30) return "Medium";
    return "Long";
  }

  // Toggle filter selection
  const toggleFilter = (type, value) => {
    switch (type) {
      case "difficulty":
        setSelectedDifficulty((prev) =>
          prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value]
        );
        break;
      case "subject":
        setSelectedSubjects((prev) =>
          prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value]
        );
        break;
      case "duration":
        setSelectedDuration((prev) =>
          prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value]
        );
        break;
      default:
        break;
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDifficulty([]);
    setSelectedSubjects([]);
    setSelectedDuration([]);
  };

  // Count active filters
  const activeFilterCount =
    [...selectedDifficulty, ...selectedSubjects, ...selectedDuration].length +
    (searchTerm ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pb-10">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-purple-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-purple-600">All Quizzes</span>
        </div>

        {/* Header with title and filter toggle */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <motion.h1
            className="text-3xl font-bold text-blue-900 mb-4 md:mb-0"
            variants={fadeIn(0.2, "up")}
            initial="hidden"
            animate="show"
          >
            Explore All Quizzes
          </motion.h1>

          <div className="flex items-center">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={fadeIn(0.3, "up")}
              initial="hidden"
              animate="show"
            >
              <SlidersHorizontal className="h-5 w-5 text-blue-900" />
              <span className="font-medium text-blue-900">
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Search & Filter Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-5 mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-blue-900 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filter Quizzes
                </h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear all filters
                  </button>
                )}
              </div>

              {/* Search Box */}
              <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by quiz title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Difficulty Filter */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                    <Award className="h-4 w-4 mr-1 text-yellow-600" />
                    Difficulty Level
                  </h3>
                  <div className="space-y-2">
                    {["Easy", "Moderate", "Advanced"].map((difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() => toggleFilter("difficulty", difficulty)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium mr-2 ${
                          selectedDifficulty.includes(difficulty)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {selectedDifficulty.includes(difficulty) && (
                          <CheckCircle className="h-3 w-3 inline mr-1" />
                        )}
                        {difficulty}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject Filter */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                    <BookOpen className="h-4 w-4 mr-1 text-purple-600" />
                    Subject
                  </h3>
                  <div className="flex flex-wrap">
                    {availableSubjects.map((subject) => (
                      <button
                        key={subject}
                        onClick={() => toggleFilter("subject", subject)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium mr-2 mb-2 ${
                          selectedSubjects.includes(subject)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {selectedSubjects.includes(subject) && (
                          <CheckCircle className="h-3 w-3 inline mr-1" />
                        )}
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration Filter */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                    <Clock3 className="h-4 w-4 mr-1 text-blue-600" />
                    Duration
                  </h3>
                  <div className="space-y-2">
                    {["Short", "Medium", "Long"].map((duration) => (
                      <button
                        key={duration}
                        onClick={() => toggleFilter("duration", duration)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium mr-2 ${
                          selectedDuration.includes(duration)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {selectedDuration.includes(duration) && (
                          <CheckCircle className="h-3 w-3 inline mr-1" />
                        )}
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
          </div>
        ) : (
          <>
            {filteredQuizzes.length === 0 ? (
              <motion.div
                className="text-center py-16"
                variants={fadeIn(0.2, "up")}
                initial="hidden"
                animate="show"
              >
                <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
                  <div className="text-5xl mb-4">🔎</div>
                  <h2 className="text-2xl font-bold text-blue-900 mb-2">
                    No quizzes found
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Try changing your filters or search criteria.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-blue-900 to-purple-800 text-white px-6 py-3 rounded-xl font-medium hover:opacity-95"
                  >
                    Clear all filters
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredQuizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz._id}
                    className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    variants={fadeIn((index * 0.1 + 0.3) % 0.5, "up", "tween")}
                    initial="hidden"
                    whileInView={"show"}
                    viewport={{ once: false, amount: 0.2 }}
                    whileHover={{ y: -5 }}
                  >
                    <Link to={`/quiz/${quiz._id}`}>
                      <div className="bg-gradient-to-r from-blue-900 to-purple-800 p-4 relative">
                        <h3 className="text-lg font-bold text-white line-clamp-2">
                          {quiz.title}
                        </h3>
                        <div className="flex items-center mt-2 text-white/80 text-sm">
                          <p>{quiz.chapterId?.subject?.exam?.name || "Exam"}</p>
                          <span className="mx-2">•</span>
                          <p className="line-clamp-1">
                            {quiz.chapterId?.subject?.name || "Subject"}
                          </p>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center">
                            <Brain className="h-5 w-5 text-purple-700 mr-1" />
                            <span className="text-sm font-medium text-gray-600 line-clamp-1">
                              {quiz.chapterId?.name || "Chapter"}
                            </span>
                          </div>
                          <div
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${getDifficultyColor(
                              quiz.questions?.length
                            )}`}
                          >
                            {getDifficultyLabel(quiz.questions?.length)}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-lg">
                            <BookOpen className="h-4 w-4 text-blue-700 mr-1" />
                            <span className="text-sm font-medium text-blue-800">
                              {quiz.questions?.length || 0} Questions
                            </span>
                          </div>
                          <div className="flex items-center bg-purple-50 px-3 py-1.5 rounded-lg">
                            <Clock3 className="h-4 w-4 text-purple-700 mr-1" />
                            <span className="text-sm font-medium text-purple-800">
                              {quiz.timeLimit || 30} mins
                            </span>
                          </div>
                        </div>

                        {quiz.price > 0 && (
                          <div className="mt-4 pt-3 border-t border-gray-100">
                            <div className="flex items-baseline">
                              <span className="text-lg font-bold text-blue-900">
                                ₹
                                {quiz.discountPrice > 0
                                  ? quiz.discountPrice
                                  : quiz.price}
                              </span>
                              {quiz.discountPrice > 0 && (
                                <>
                                  <span className="ml-2 text-sm text-gray-500 line-through">
                                    ₹{quiz.price}
                                  </span>
                                  <span className="ml-2 text-sm text-green-500">
                                    (
                                    {Math.round(
                                      (1 - quiz.discountPrice / quiz.price) *
                                        100
                                    )}
                                    % off)
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="mt-4">
                          <Link to={`/quiz/${quiz._id}`}>
                            <div className="bg-gradient-to-r from-blue-700 to-purple-700 text-white py-2 px-4 rounded-xl font-medium text-center">
                              View Details
                            </div>
                          </Link>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
