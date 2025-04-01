import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/Anim/ScrollAnim.js";
import { BookOpen, Clock3, Award, Brain } from "lucide-react";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "linear-gradient(to right, #1e3a8a, #312e81)",
        borderRadius: "50%",
        right: "10px",
        zIndex: 1,
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClick}
    >
      <i className="fas fa-chevron-right text-white"></i>
    </div>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "linear-gradient(to right, #1e3a8a, #312e81)",
        borderRadius: "50%",
        left: "10px",
        zIndex: 1,
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClick}
    >
      <i className="fas fa-chevron-left text-white"></i>
    </div>
  );
}

// Get difficulty color
function getDifficultyColor(questionCount) {
  if (questionCount < 10) return "bg-green-100 text-green-800";
  if (questionCount < 20) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
}

// Get difficulty label
function getDifficultyLabel(questionCount) {
  if (questionCount < 10) return "Easy";
  if (questionCount < 20) return "Moderate";
  return "Advanced";
}

// Get icon based on subject/exam name
function getSubjectIcon(subject) {
  const subjectLower = subject?.toLowerCase() || "";

  if (subjectLower.includes("math")) return <Brain className="h-6 w-6" />;
  if (subjectLower.includes("science")) return <Award className="h-6 w-6" />;
  return <BookOpen className="h-6 w-6" />;
}

export default function PopularQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/quizzes/popularQuizzes");
        if (!response.ok) throw new Error("Failed to fetch popular quizzes.");
        const data = await response.json();
        setQuizzes(data.quizzes || []);
      } catch (error) {
        console.error("Error fetching popular quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Placeholder data for development if API doesn't return data yet
  const placeholderQuizzes =
    loading && quizzes.length === 0
      ? [
          {
            _id: "1",
            title: "Physics Fundamentals",
            timeLimit: 30,
            questions: Array(12).fill({}),
            chapterId: {
              name: "Mechanics",
              subject: { name: "Physics", exam: { name: "JEE" } },
            },
          },
          {
            _id: "2",
            title: "Organic Chemistry",
            timeLimit: 45,
            questions: Array(18).fill({}),
            chapterId: {
              name: "Alkanes",
              subject: { name: "Chemistry", exam: { name: "NEET" } },
            },
          },
          {
            _id: "3",
            title: "Calculus Mastery",
            timeLimit: 60,
            questions: Array(25).fill({}),
            chapterId: {
              name: "Integrals",
              subject: { name: "Mathematics", exam: { name: "IIT" } },
            },
          },
        ]
      : [];

  const displayQuizzes = quizzes.length > 0 ? quizzes : placeholderQuizzes;

  return (
    <motion.div
      className="py-14 px-4 bg-gradient-to-r from-blue-50 to-purple-50"
      variants={fadeIn(0.4, "up")}
      initial="hidden"
      whileInView={"show"}
      viewport={{ once: false, amount: 0.2 }}
    >
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex items-center justify-center mb-8"
          variants={fadeIn(0.3, "up")}
        >
          <div className="flex items-center bg-gradient-to-r from-blue-900 to-purple-800 px-5 py-2 rounded-full">
            <Award className="h-6 w-6 text-white mr-2" />
            <h2 className="text-3xl font-bold text-white">
              Test Your Knowledge
            </h2>
          </div>
        </motion.div>

        <motion.p
          className="text-blue-900 text-center max-w-2xl mx-auto mb-10"
          variants={fadeIn(0.4, "up")}
        >
          Challenge yourself with our most popular quizzes and assess your
          understanding of key concepts
        </motion.p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
          </div>
        ) : (
          <Slider {...settings} className="quiz-slider">
            {displayQuizzes.map((quiz, index) => (
              <div key={quiz._id} className="px-4">
                <Link to={`/quiz/${quiz._id}`}>
                  <motion.div
                    className="bg-white rounded-2xl shadow-lg overflow-hidden h-full"
                    whileHover={{
                      y: -8,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                    transition={{ duration: 0.2 }}
                    variants={fadeIn((index * 0.1 + 0.3) % 0.5, "up", "tween")}
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-blue-900 to-purple-800 p-4 relative">
                      <div className="absolute top-0 right-0 mt-2 mr-2">
                        <motion.div
                          className="bg-white rounded-full p-2"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 1, ease: "easeInOut" }}
                        >
                          {getSubjectIcon(quiz.chapterId?.subject?.name)}
                        </motion.div>
                      </div>
                      <h3 className="text-xl font-bold text-white pr-12 line-clamp-2">
                        {quiz.title}
                      </h3>
                      <div className="flex items-center mt-2 text-white/80 text-sm">
                        <p>{quiz.chapterId?.subject?.exam?.name || "Exam"}</p>
                        <span className="mx-2">•</span>
                        <p>{quiz.chapterId?.subject?.name || "Subject"}</p>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <Brain className="h-5 w-5 text-purple-700 mr-1" />
                          <span className="text-sm font-medium text-gray-600">
                            Chapter: {quiz.chapterId?.name || "Chapter"}
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

                      {/* Quiz Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-blue-50 p-3 rounded-xl">
                          <div className="flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-blue-700 mr-1" />
                            <span className="text-sm font-semibold text-blue-800">
                              {quiz.questions?.length || 0} Questions
                            </span>
                          </div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-xl">
                          <div className="flex items-center justify-center">
                            <Clock3 className="h-4 w-4 text-purple-700 mr-1" />
                            <span className="text-sm font-semibold text-purple-800">
                              {quiz.timeLimit || 30} mins
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-5 pb-5">
                      <motion.div
                        className="bg-gradient-to-r from-blue-700 to-purple-700 text-white py-2 px-4 rounded-xl font-medium text-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Start Quiz
                      </motion.div>
                    </div>

                    {/* "New" Badge */}
                    {index < 2 && (
                      <div className="absolute top-0 left-0 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 transform -translate-y-1/3 translate-x-3 rotate-12 rounded-lg z-10 shadow-lg">
                        NEW
                      </div>
                    )}
                  </motion.div>
                </Link>
              </div>
            ))}
          </Slider>
        )}

        <div className="mt-10 text-center">
          <Link to="/all-quizzes">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 
                       text-white px-6 py-3 rounded-xl font-medium
                       hover:opacity-95 transition-all duration-200 
                       shadow-lg hover:shadow-xl flex items-center mx-auto"
            >
              <span>Explore All Quizzes</span>
              <Award className="ml-2 h-5 w-5" />
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
