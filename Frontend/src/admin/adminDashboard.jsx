import React, { useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    examName: "",
    subjectName: "",
    chapterName: "",
    quizTitle: "",
    quizPrice: "",
    questionText: "",
    options: [{ text: "", isCorrect: false }],
    explanation: "",
    difficulty: "Easy",
    year: new Date().getFullYear(),
  });

  const [ids, setIds] = useState({
    examId: null,
    subjectId: null,
    chapterId: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = formData.options.map((option, i) =>
      i === index ? { ...option, [field]: value } : option
    );
    setFormData({ ...formData, options: updatedOptions });
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { text: "", isCorrect: false }],
    });
  };

  const removeOption = (index) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index),
    });
  };

  const handleNext = async () => {
    try {
      if (step === 1) {
        // Add Exam
        const examResponse = await axios.post("/api/exams/addexam", {
          name: formData.examName,
        });
        setIds((prev) => ({ ...prev, examId: examResponse.data.exam._id }));
        setStep(2);
      } else if (step === 2) {
        // Add Subject
        const subjectResponse = await axios.post("/api/subjects/addsubject", {
          name: formData.subjectName,
          examId: ids.examId,
        });
        setIds((prev) => ({ ...prev, subjectId: subjectResponse.data.subject._id }));
        setStep(3);
      } else if (step === 3) {
        // Add Chapter
        console.log(ids.subjectId)
        const chapterResponse = await axios.post("/api/chapters/addchapter", {
          name: formData.chapterName,
          subjectId: ids.subjectId,
        });
        setIds((prev) => ({ ...prev, chapterId: chapterResponse.data.chapter._id }));
        setStep(4);
      } else if (step === 4) {
        // Add Quiz
        await axios.post("/api/quizzes/addquiz", {
          title: formData.quizTitle,
          price: formData.quizPrice,
          chapterId: ids.chapterId,
          questions: [
            {
              text: formData.questionText,
              options: formData.options,
              explanation: formData.explanation,
              difficulty: formData.difficulty,
              year: formData.year,
            },
          ],
        });
        alert("Quiz added successfully!");
        resetForm();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add data. Please check the console for details.");
    }
  };

  const resetForm = () => {
    setFormData({
      examName: "",
      subjectName: "",
      chapterName: "",
      quizTitle: "",
      quizPrice: "",
      questionText: "",
      options: [{ text: "", isCorrect: false }],
      explanation: "",
      difficulty: "Easy",
      year: new Date().getFullYear(),
    });
    setIds({ examId: null, subjectId: null, chapterId: null });
    setStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">Admin Dashboard</h1>
      <form className="space-y-4">
        {step === 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Exam Name</label>
            <input
              type="text"
              name="examName"
              value={formData.examName}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject Name</label>
            <input
              type="text"
              name="subjectName"
              value={formData.subjectName}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        )}

        {step === 3 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Chapter Name</label>
            <input
              type="text"
              name="chapterName"
              value={formData.chapterName}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        )}

        {step === 4 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quiz Title</label>
              <input
                type="text"
                name="quizTitle"
                value={formData.quizTitle}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quiz Price</label>
              <input
                type="number"
                name="quizPrice"
                value={formData.quizPrice}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Question Text</label>
              <textarea
                name="questionText"
                value={formData.questionText}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Options</label>
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, "text", e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  <input
                    type="checkbox"
                    checked={option.isCorrect}
                    onChange={(e) => handleOptionChange(index, "isCorrect", e.target.checked)}
                    className="mt-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="mt-2 text-indigo-500"
              >
                Add Option
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Explanation</label>
              <textarea
                name="explanation"
                value={formData.explanation}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </>
        )}

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-700"
        >
          {step < 4 ? "Next" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;
