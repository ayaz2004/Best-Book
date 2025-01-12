import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    examName: "",
    subjectName: "",
    description: "",
    chapterName: "",
    quizTitle: "",
    discount: 0,
    price: 0,
    questions: [],
  });

  // Track IDs through steps
  const [ids, setIds] = useState({
    examId: null,
    subjectId: null,
    chapterId: null,
  });

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

  const handleNext = async () => {
    try {
      if (step === 1) {
        if (!formData.examName || !formData.description || !formData.price) {
          setError("Please fill all required fields");
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
          return;
        }

        // Create quiz FormData
        const quizFormData = new FormData();
        quizFormData.append("title", formData.quizTitle);
        quizFormData.append("price", formData.price);
        quizFormData.append("chapterId", ids.chapterId);

        // Format questions
        formData.questions.forEach((q, index) => {
          quizFormData.append(
            `questions[${index}][text]`,
            q.text.toLowerCase()
          );
          quizFormData.append(
            `questions[${index}][explanation]`,
            q.explanation || ""
          );
          quizFormData.append(`questions[${index}][difficulty]`, q.difficulty);
          quizFormData.append(`questions[${index}][year]`, q.year);

          q.options.forEach((opt, optIndex) => {
            quizFormData.append(
              `questions[${index}][options][${optIndex}][text]`,
              opt.text
            );
            quizFormData.append(
              `questions[${index}][options][${optIndex}][isCorrect]`,
              opt.isCorrect
            );
          });

          if (q.questionFig) {
            quizFormData.append(
              `questions[${index}][questionFig]`,
              q.questionFig
            );
          }
          if (q.answerFig) {
            quizFormData.append(`questions[${index}][answerFig]`, q.answerFig);
          }
        });

        // Submit quiz
        const quizResponse = await fetch("/api/quizzes/addquiz", {
          method: "POST",
          body: quizFormData,
        });

        const quizData = await quizResponse.json();
        if (!quizResponse.ok) {
          throw new Error(quizData.message || "Failed to create quiz");
        }

        navigate("/admin/manage-quiz");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`step ${s <= step ? "active" : ""}`}>
              Step {s}
            </div>
          ))}
        </div>
      </div>

      <form className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Exam Name
              </label>
              <input
                type="text"
                name="examName"
                value={formData.examName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Discount</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Subject Name
            </label>
            <input
              type="text"
              name="subjectName"
              value={formData.subjectName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        )}

        {step === 3 && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Chapter Name
            </label>
            <input
              type="text"
              name="chapterName"
              value={formData.chapterName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Quiz Title
              </label>
              <input
                type="text"
                name="quizTitle"
                value={formData.quizTitle}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {formData.questions.map((question, qIndex) => (
              <div key={qIndex} className="border p-4 rounded space-y-4">
                <input
                  type="text"
                  placeholder="Question Text"
                  value={question.text}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "text", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Question Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(qIndex, "questionFig", e.target.files[0])
                    }
                    className="w-full"
                  />
                </div>

                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex space-x-2">
                    <input
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
                      className="flex-1 p-2 border rounded"
                    />
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
                      className="form-checkbox"
                    />
                  </div>
                ))}

                <div>
                  <input
                    type="text"
                    placeholder="Explanation"
                    value={question.explanation}
                    onChange={(e) =>
                      handleQuestionChange(
                        qIndex,
                        "explanation",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border rounded mb-2"
                  />

                  <label className="block text-sm font-medium mb-1">
                    Explanation Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(qIndex, "answerFig", e.target.files[0])
                    }
                    className="w-full"
                  />
                </div>

                <select
                  value={question.difficulty}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "difficulty", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Question
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={handleNext}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {step === 4 ? "Submit Quiz" : "Next Step"}
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;
