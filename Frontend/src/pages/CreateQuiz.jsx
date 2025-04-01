import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiPlus,
  HiOutlineDocumentText,
  HiCheck,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
  HiOutlineCloudUpload,
  HiOutlineExclamation,
  HiOutlineClock,
  HiOutlineAcademicCap,
  HiOutlineTrash,
  HiOutlineQuestionMarkCircle,
  HiOutlinePencilAlt,
  HiOutlineDuplicate,
  HiOutlineCog,
  HiOutlineBookOpen,
  HiOutlineTag,
  HiOutlineCurrencyRupee,
} from "react-icons/hi";
import {
  TextInput,
  Textarea,
  Spinner,
  Badge,
  Button,
  Tooltip,
} from "flowbite-react";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  // Form state (same as original)
  const [formData, setFormData] = useState({
    examName: "",
    subjectName: "",
    description: "",
    chapterName: "",
    quizTitle: "",
    quizDescription: "",
    discount: 0,
    price: 0,
    timeLimit: 30, // Default time limit (minutes)
    passingScore: 60, // Default passing score (percentage)
    questions: [],
  });

  // Track IDs through steps
  const [ids, setIds] = useState({
    examId: null,
    subjectId: null,
    chapterId: null,
    quizId: null,
  });

  // Step titles and descriptions for better navigation
  const stepInfo = [
    {
      title: "Exam Information",
      description: "Set up the basic exam details and pricing",
      icon: <HiOutlineDocumentText className="h-5 w-5" />,
    },
    {
      title: "Subject Details",
      description: "Add subject information for this exam",
      icon: <HiOutlineAcademicCap className="h-5 w-5" />,
    },
    {
      title: "Chapter Details",
      description: "Define chapter information within the subject",
      icon: <HiOutlineCog className="h-5 w-5" />,
    },
    {
      title: "Quiz Content",
      description: "Create questions and configure quiz settings",
      icon: <HiOutlineQuestionMarkCircle className="h-5 w-5" />,
    },
  ];

  // Handler functions remain the same as original
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          text: "",
          options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
          questionFig: null,
          answerFig: null,
          explanation: "",
          difficulty: "Easy",
          year: new Date().getFullYear(),
        },
      ],
    }));
  };

  const handleQuestionChange = (qIndex, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex][field] = value;
    setFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].options[oIndex][field] = value;
    setFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  const handleFileChange = (qIndex, fieldName, file) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex][fieldName] = file;
    setFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      setError("");

      if (step === 1) {
        if (!formData.examName || !formData.description || !formData.price) {
          setError("Please fill all required fields");
          setLoading(false);
          return;
        }

        const examResponse = await fetch("/api/exams/addexam", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.examName,
            description: formData.description,
            discount: Number(formData.discount),
            price: Number(formData.price),
          }),
        });

        const examData = await examResponse.json();
        if (!examResponse.ok) {
          throw new Error(examData.message || "Failed to create exam");
        }

        setIds((prev) => ({ ...prev, examId: examData.exam._id }));
        setStep(2);
      } else if (step === 2) {
        if (!formData.subjectName) {
          setError("Subject name is required");
          setLoading(false);
          return;
        }

        const subjectResponse = await fetch("/api/subjects/addsubject", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.subjectName,
            examId: ids.examId,
          }),
        });

        const subjectData = await subjectResponse.json();
        if (!subjectResponse.ok) {
          throw new Error(subjectData.message || "Failed to create subject");
        }

        setIds((prev) => ({ ...prev, subjectId: subjectData.subject._id }));
        setStep(3);
      } else if (step === 3) {
        if (!formData.chapterName) {
          setError("Chapter name is required");
          setLoading(false);
          return;
        }

        const chapterResponse = await fetch("/api/chapters/addchapter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.chapterName,
            subjectId: ids.subjectId,
          }),
        });

        const chapterData = await chapterResponse.json();
        if (!chapterResponse.ok) {
          throw new Error(chapterData.message || "Failed to create chapter");
        }

        setIds((prev) => ({ ...prev, chapterId: chapterData.chapter._id }));
        setStep(4);
      } else if (step === 4) {
        if (!formData.quizTitle || formData.questions.length === 0) {
          setError("Please fill all quiz fields and add at least one question");
          setLoading(false);
          return;
        }

        if (formData.timeLimit < 1) {
          setError("Time limit must be at least 1 minute");
          setLoading(false);
          return;
        }

        if (formData.passingScore < 1 || formData.passingScore > 100) {
          setError("Passing score must be between 1% and 100%");
          setLoading(false);
          return;
        }

        // Validate each question
        for (let i = 0; i < formData.questions.length; i++) {
          const q = formData.questions[i];
          if (!q.text) {
            setError(`Question ${i + 1} is missing text`);
            setLoading(false);
            return;
          }

          // Check if at least one option is marked as correct
          const hasCorrectOption = q.options.some((opt) => opt.isCorrect);
          if (!hasCorrectOption) {
            setError(`Question ${i + 1} must have at least one correct answer`);
            setLoading(false);
            return;
          }

          // Validate all options have text
          for (let j = 0; j < q.options.length; j++) {
            if (!q.options[j].text) {
              setError(`Option ${j + 1} in Question ${i + 1} is missing text`);
              setLoading(false);
              return;
            }
          }
        }

        const originalPrice = Number(formData.price);
        const discountAmount = Number(formData.discount) || 0;
        const calculatedDiscountPrice = Math.max(
          0,
          originalPrice - discountAmount
        );

        // Create quiz FormData
        const quizFormData = new FormData();
        quizFormData.append("title", formData.quizTitle);
        quizFormData.append("description", formData.quizDescription || "");
        quizFormData.append("chapterId", ids.chapterId);
        quizFormData.append("isPublished", isPublished ? "true" : "false");
        quizFormData.append("price", originalPrice);
        quizFormData.append("discountPrice", calculatedDiscountPrice);
        quizFormData.append("timeLimit", formData.timeLimit);
        quizFormData.append("passingScore", formData.passingScore);

        // Prepare questions as JSON
        const questionsData = formData.questions.map((q) => ({
          text: q.text,
          options: q.options.map((opt) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
          })),
          explanation: q.explanation || "",
          difficulty: q.difficulty,
        }));

        quizFormData.append("questions", JSON.stringify(questionsData));

        // Handle file uploads separately
        formData.questions.forEach((q, index) => {
          if (q.questionFig) {
            quizFormData.append("questionFigure", q.questionFig);
            quizFormData.append("questionFigureIndex", index);
          }

          if (q.answerFig) {
            quizFormData.append("answerFigure", q.answerFig);
            quizFormData.append("answerFigureIndex", index);
          }
        });

        console.log("Quiz form data entries:");
        for (let [key, value] of quizFormData.entries()) {
          if (key === "questionFigure" || key === "answerFigure") {
            console.log(key, "(File object present)");
          } else {
            console.log(key, value);
          }
        }

        try {
          // Submit quiz
          const quizResponse = await fetch("/api/quizzes/addquiz", {
            method: "POST",
            body: quizFormData,
          });

          let responseData;
          try {
            responseData = await quizResponse.json();
          } catch (e) {
            // If not JSON, get text
            const text = await quizResponse.text();
            responseData = { message: text || "Non-JSON response from server" };
          }

          if (!quizResponse.ok) {
            console.error("Server response:", responseData);
            throw new Error(
              responseData.message ||
                `Error ${quizResponse.status}: Failed to create quiz`
            );
          }
          // Success - navigate back to quiz dashboard
          navigate("/manage-quiz");
        } catch (error) {
          console.error("API error:", error);
          setError(error.message || "Failed to create quiz");
          setLoading(false);
        }
      }
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 flex flex-col"
    >
      {/* Modern Header Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md mb-6 p-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-purple-100 p-2 rounded-lg">
                <HiOutlineDocumentText className="text-purple-600 text-xl" />
              </span>
              Create Quiz
            </h1>
            <p className="text-gray-500 mt-1">
              {stepInfo[step - 1].description}
            </p>
          </div>

          <Button
            color="light"
            onClick={() => navigate("/manage-quiz")}
            className="whitespace-nowrap"
          >
            Cancel
          </Button>
        </div>
      </motion.div>

      {/* Modern Progress Steps */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-md p-6 mb-6"
      >
        <div className="hidden md:flex justify-between relative mb-2">
          <div className="w-full bg-gray-200 h-1 absolute top-5 transform -translate-y-1/2 z-0"></div>

          {stepInfo.map((info, index) => {
            const stepNum = index + 1;
            let statusColor;

            if (stepNum < step)
              statusColor = "bg-green-500 text-white border-green-500";
            else if (stepNum === step)
              statusColor = "bg-purple-600 text-white border-purple-600";
            else statusColor = "bg-white text-gray-400 border-gray-300";

            return (
              <div
                key={stepNum}
                className="z-10 flex flex-col items-center relative w-1/4"
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${statusColor} transition-all duration-200`}
                >
                  {stepNum < step ? <HiCheck className="w-5 h-5" /> : stepNum}
                </div>
                <span
                  className={`text-sm font-medium mt-2 ${
                    stepNum === step ? "text-purple-600" : "text-gray-500"
                  }`}
                >
                  {info.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mobile step indicator */}
        <div className="flex md:hidden items-center justify-between">
          <span className="font-medium text-purple-600">Step {step}/4:</span>
          <span className="font-medium">{stepInfo[step - 1].title}</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 w-2 rounded-full ${
                  s === step
                    ? "bg-purple-600"
                    : s < step
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md text-red-700"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <HiOutlineExclamation className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Form Container */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md p-6 mb-6 flex-1"
      >
        <form className="space-y-6">
          {/* Step 1: Exam Information - Redesigned */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  {stepInfo[0].icon}
                  <h2 className="text-xl font-bold text-gray-800">
                    {stepInfo[0].title}
                  </h2>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Create the base exam that will contain subjects, chapters, and
                  quizzes
                </p>
              </div>

              <div className="space-y-4 bg-gray-50 p-5 rounded-lg">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <HiOutlineDocumentText className="text-purple-600" />
                    Exam Name <span className="text-red-500">*</span>
                  </label>
                  <TextInput
                    type="text"
                    name="examName"
                    value={formData.examName}
                    onChange={handleInputChange}
                    placeholder="Enter exam name"
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Example: CBSE Class 10 Exam, Medical Entrance Test
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <HiOutlinePencilAlt className="text-purple-600" />
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter exam description"
                    required
                    rows={4}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <HiOutlineCurrencyRupee className="text-purple-600" />
                      Price (Rs) <span className="text-red-500">*</span>
                    </label>
                    <TextInput
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Enter price"
                      min="0"
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <HiOutlineTag className="text-purple-600" />
                      Discount (Rs)
                    </label>
                    <TextInput
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      placeholder="Enter discount amount"
                      min="0"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Subject Details - Redesigned */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  {stepInfo[1].icon}
                  <h2 className="text-xl font-bold text-gray-800">
                    {stepInfo[1].title}
                  </h2>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Add a subject that belongs to the exam created in the previous
                  step
                </p>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
                  <div className="flex items-center">
                    <HiOutlineDocumentText className="text-blue-600 h-5 w-5 mr-2" />
                    <p className="text-sm text-blue-700">
                      <strong>Connected to:</strong> {formData.examName} (Exam)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <HiOutlineAcademicCap className="text-purple-600" />
                    Subject Name <span className="text-red-500">*</span>
                  </label>
                  <TextInput
                    type="text"
                    name="subjectName"
                    value={formData.subjectName}
                    onChange={handleInputChange}
                    placeholder="Enter subject name"
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Example: Physics, Mathematics, Biology
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Chapter Details - Redesigned */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  {stepInfo[2].icon}
                  <h2 className="text-xl font-bold text-gray-800">
                    {stepInfo[2].title}
                  </h2>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Add a chapter that belongs to the subject created in the
                  previous step
                </p>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
                  <div className="flex items-center">
                    <HiOutlineAcademicCap className="text-blue-600 h-5 w-5 mr-2" />
                    <p className="text-sm text-blue-700">
                      <strong>Connected to:</strong> {formData.subjectName}{" "}
                      (Subject) in {formData.examName} (Exam)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <HiOutlineBookOpen className="text-purple-600" />
                    Chapter Name <span className="text-red-500">*</span>
                  </label>
                  <TextInput
                    type="text"
                    name="chapterName"
                    value={formData.chapterName}
                    onChange={handleInputChange}
                    placeholder="Enter chapter name"
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Example: Mechanics, Calculus, Cell Biology
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Quiz Content */}
          {/* Step 4: Quiz Content - Modernized */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <HiOutlineQuestionMarkCircle className="h-5 w-5 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-800">
                    Quiz Content
                  </h2>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Create questions and configure quiz settings
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-center">
                  <HiOutlineBookOpen className="text-blue-600 h-5 w-5 mr-2" />
                  <p className="text-sm text-blue-700">
                    <strong>Connected to:</strong> {formData.chapterName}{" "}
                    (Chapter) in {formData.subjectName} (Subject)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-5 rounded-lg">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <HiOutlineDocumentText className="text-purple-600" />
                    Quiz Title <span className="text-red-500">*</span>
                  </label>
                  <TextInput
                    type="text"
                    name="quizTitle"
                    value={formData.quizTitle}
                    onChange={handleInputChange}
                    placeholder="Enter quiz title"
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <HiOutlinePencilAlt className="text-purple-600" />
                    Quiz Description
                  </label>
                  <Textarea
                    name="quizDescription"
                    value={formData.quizDescription}
                    onChange={handleInputChange}
                    placeholder="Enter quiz description (optional)"
                    rows={2}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-5 rounded-lg">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <HiOutlineClock className="text-purple-600" />
                    Time Limit (minutes) <span className="text-red-500">*</span>
                  </label>
                  <TextInput
                    type="number"
                    name="timeLimit"
                    value={formData.timeLimit}
                    onChange={handleInputChange}
                    placeholder="Time allowed for quiz"
                    min="1"
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Recommended: 1-2 minutes per question
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <HiOutlineAcademicCap className="text-purple-600" />
                    Passing Score (%) <span className="text-red-500">*</span>
                  </label>
                  <TextInput
                    type="number"
                    name="passingScore"
                    value={formData.passingScore}
                    onChange={handleInputChange}
                    placeholder="Score required to pass"
                    min="1"
                    max="100"
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Typical passing scores: 60-80%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-8 mb-4">
                <h3 className="font-medium text-lg text-gray-800 flex items-center gap-2">
                  <HiOutlineQuestionMarkCircle className="text-purple-600" />
                  Questions ({formData.questions.length})
                </h3>
                <Badge
                  color={formData.questions.length > 0 ? "success" : "warning"}
                >
                  {formData.questions.length > 0
                    ? `${formData.questions.length} Questions Added`
                    : "No Questions Yet"}
                </Badge>
              </div>

              {formData.questions.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg mt-4 mb-6">
                  <HiOutlineQuestionMarkCircle className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-500 text-center">
                    No questions added yet
                  </p>
                  <p className="text-gray-400 text-sm text-center mt-1">
                    Click "Add New Question" to create your first question
                  </p>
                </div>
              )}

              {formData.questions.map((question, qIndex) => (
                <motion.div
                  key={qIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * qIndex }}
                  className="border border-gray-200 p-5 rounded-xl space-y-4 mb-6 bg-gray-50 shadow-sm"
                >
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <h4 className="font-medium text-purple-800 flex items-center gap-1">
                      <HiOutlineQuestionMarkCircle className="text-purple-600" />
                      Question {qIndex + 1}
                    </h4>
                    <div className="flex gap-2 items-center">
                      <Badge
                        color={
                          question.difficulty === "Easy"
                            ? "success"
                            : question.difficulty === "Medium"
                            ? "warning"
                            : "failure"
                        }
                      >
                        {question.difficulty}
                      </Badge>
                      <Tooltip content="Remove this question">
                        <Button
                          color="light"
                          size="xs"
                          onClick={() => {
                            const newQuestions = [...formData.questions];
                            newQuestions.splice(qIndex, 1);
                            setFormData({
                              ...formData,
                              questions: newQuestions,
                            });
                          }}
                        >
                          <HiOutlineTrash />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      Question Text <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      placeholder="Enter question text"
                      value={question.text}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, "text", e.target.value)
                      }
                      className="w-full"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                      <span>Question Image (Optional)</span>
                      {question.questionFig && (
                        <Badge color="success">Image Selected</Badge>
                      )}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange(
                            qIndex,
                            "questionFig",
                            e.target.files[0]
                          )
                        }
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      />
                      {question.questionFig && (
                        <button
                          type="button"
                          onClick={() =>
                            handleFileChange(qIndex, "questionFig", null)
                          }
                          className="p-2 text-red-500 hover:text-red-700"
                          title="Remove image"
                        >
                          <HiOutlineTrash />
                        </button>
                      )}
                    </div>
                    {question.questionFig && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          Selected: {question.questionFig.name}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mt-6">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <span>
                        Answer Options <span className="text-red-500">*</span>
                      </span>
                      <Tooltip content="Check the correct answer(s)">
                        <HiOutlineQuestionMarkCircle className="text-gray-400" />
                      </Tooltip>
                    </label>

                    {question.options.map((option, oIndex) => (
                      <div
                        key={oIndex}
                        className={`flex items-center space-x-2 p-3 rounded-lg ${
                          option.isCorrect
                            ? "bg-green-50 border border-green-100"
                            : "bg-white border border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={option.isCorrect}
                            onChange={(e) =>
                              handleOptionChange(
                                qIndex,
                                oIndex,
                                "isCorrect",
                                e.target.checked
                              )
                            }
                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                          />
                        </div>
                        <div className="flex-1">
                          <TextInput
                            type="text"
                            placeholder={`Option ${oIndex + 1}`}
                            value={option.text}
                            onChange={(e) =>
                              handleOptionChange(
                                qIndex,
                                oIndex,
                                "text",
                                e.target.value
                              )
                            }
                            className="w-full"
                          />
                        </div>
                        <div className="flex items-center text-xs">
                          {option.isCorrect && (
                            <Badge color="success">Correct</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 mt-6">
                    <label className="text-sm font-medium text-gray-700">
                      Explanation (helps students understand the answer)
                    </label>
                    <Textarea
                      placeholder="Explain why the correct answer is right"
                      value={question.explanation}
                      onChange={(e) =>
                        handleQuestionChange(
                          qIndex,
                          "explanation",
                          e.target.value
                        )
                      }
                      className="w-full"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                      <span>Explanation Image (Optional)</span>
                      {question.answerFig && (
                        <Badge color="success">Image Selected</Badge>
                      )}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange(
                            qIndex,
                            "answerFig",
                            e.target.files[0]
                          )
                        }
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      />
                      {question.answerFig && (
                        <button
                          type="button"
                          onClick={() =>
                            handleFileChange(qIndex, "answerFig", null)
                          }
                          className="p-2 text-red-500 hover:text-red-700"
                          title="Remove image"
                        >
                          <HiOutlineTrash />
                        </button>
                      )}
                    </div>
                    {question.answerFig && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          Selected: {question.answerFig.name}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Difficulty Level
                      </label>
                      <select
                        value={question.difficulty}
                        onChange={(e) =>
                          handleQuestionChange(
                            qIndex,
                            "difficulty",
                            e.target.value
                          )
                        }
                        className="block w-full p-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Year (Optional)
                      </label>
                      <TextInput
                        type="number"
                        placeholder="Year of the question (e.g., 2023)"
                        value={question.year}
                        onChange={(e) =>
                          handleQuestionChange(qIndex, "year", e.target.value)
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={addQuestion}
                className="w-full p-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 flex items-center justify-center gap-2 shadow-md transition-all duration-200"
              >
                <HiPlus className="h-5 w-5" />
                Add New Question
              </motion.button>
              <div className="mt-8 p-5 border border-gray-200 rounded-xl bg-gray-50 shadow-sm">
                <div className="flex items-center mb-4">
                  <input
                    id="published-checkbox"
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label
                    htmlFor="published-checkbox"
                    className="ml-3 text-sm font-medium text-gray-700"
                  >
                    Publish quiz immediately after creation
                  </label>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    isPublished ? "bg-green-50" : "bg-blue-50"
                  }`}
                >
                  <div className="flex items-center">
                    {isPublished ? (
                      <HiCheck className="h-5 w-5 text-green-600 mr-2" />
                    ) : (
                      <HiOutlineDuplicate className="h-5 w-5 text-blue-600 mr-2" />
                    )}
                    <p
                      className={`text-sm ${
                        isPublished ? "text-green-700" : "text-blue-700"
                      }`}
                    >
                      {isPublished
                        ? "The quiz will be available to users immediately after creation."
                        : "The quiz will be saved as draft. You can publish it later from the dashboard."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-between mt-8 gap-4">
            {step > 1 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleBack}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 flex items-center justify-center gap-2 transition-all duration-200"
                disabled={loading}
              >
                <HiOutlineArrowLeft className="h-5 w-5" />
                Previous Step
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleNext}
              className={`px-6 py-3 ${
                step === 4
                  ? isPublished
                    ? "bg-gradient-to-r from-green-600 to-green-700"
                    : "bg-gradient-to-r from-blue-800 to-purple-800"
                  : "bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800"
              } text-white rounded-xl hover:shadow-lg flex items-center justify-center gap-2 shadow-md transition-all duration-200 ${
                step === 1 ? "w-full sm:w-auto sm:ml-auto" : "sm:ml-auto"
              }`}
              disabled={loading}
            >
              {loading ? (
                <Spinner size="sm" color="white" />
              ) : step === 4 ? (
                <>
                  {isPublished ? (
                    <>
                      <HiCheck className="h-5 w-5" />
                      Create & Publish Quiz
                    </>
                  ) : (
                    <>
                      <HiOutlineDuplicate className="h-5 w-5" />
                      Save as Draft
                    </>
                  )}
                </>
              ) : (
                <>
                  Next Step
                  <HiOutlineArrowRight className="h-5 w-5" />
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateQuiz;
