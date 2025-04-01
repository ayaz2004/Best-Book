import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  TextInput,
  Badge,
  Spinner,
  ToggleSwitch,
} from "flowbite-react";
import {
  HiPlus,
  HiPencilAlt,
  HiTrash,
  HiCheck,
  HiX,
  HiRefresh,
  HiDocumentText,
  HiOutlineDocumentText,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const AdminQuizDashboard = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizData, setQuizData] = useState({
    title: "",
    chapterId: "",
    questions: [],
    isPublished: false,
  });
  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  const { currentUser } = useSelector((state) => state.user);

  // Fetch quizzes from the server
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/quizzes/getallquizzes");
      if (!response.ok) throw new Error("Failed to fetch quizzes.");
      const data = await response.json();
      setQuizzes(data.quizzes);
      calculateStatistics(data.quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (quizData) => {
    const stats = {
      total: quizData.length,
      active: quizData.filter((quiz) => quiz.isPublished).length,
      inactive: quizData.filter((quiz) => !quiz.isPublished).length,
    };
    setStatistics(stats);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuizData({
      ...quizData,
      [name]: value,
    });
  };

  const handleTogglePublish = (checked) => {
    setQuizData({
      ...quizData,
      isPublished: checked,
    });
  };

  const handleUpdateQuiz = async () => {
    if (!quizData.title) {
      setError("Quiz title is required");
      return;
    }

    try {
      setModalLoading(true);
      setError(null);

      const response = await fetch(`/api/quizzes/update/${quizData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.accessToken}`,
        },
        body: JSON.stringify({
          title: quizData.title,
          isPublished: quizData.isPublished,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update quiz");
      }

      await fetchQuizzes();
      setShowModal(false);
    } catch (error) {
      console.error("Error updating quiz:", error);
      setError(error.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleTogglePublishStatus = async (quizId, currentStatus) => {
    try {
      setError(null);
      const response = await fetch(`/api/quizzes/toggle-publish/${quizId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${currentUser?.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${currentStatus ? "unpublish" : "publish"} quiz.`
        );
      }

      // Update the quiz status in the local state
      setQuizzes((prevQuizzes) =>
        prevQuizzes.map((quiz) =>
          quiz._id === quizId
            ? { ...quiz, isPublished: !quiz.isPublished }
            : quiz
        )
      );

      // Update statistics
      calculateStatistics(
        quizzes.map((quiz) =>
          quiz._id === quizId
            ? { ...quiz, isPublished: !quiz.isPublished }
            : quiz
        )
      );
    } catch (error) {
      console.error("Error toggling quiz status:", error);
      setError(error.message);
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/quizzes/deletequiz/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser?.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete quiz.");
      }

      fetchQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
      setError(error.message);
    }
  };

  const openModal = (quiz = null) => {
    setIsEdit(!!quiz);
    setQuizData(
      quiz || {
        title: "",
        chapterId: "",
        questions: [],
        isPublished: false,
      }
    );
    setShowModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-purple-50 p-4 sm:p-6 md:p-8 flex flex-col"
    >
      {/* Header Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-800 text-white p-6 rounded-2xl shadow-xl mb-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <HiOutlineDocumentText className="text-3xl" />
            <h1 className="text-2xl md:text-3xl font-bold">
              Admin Dashboard - Manage Quizzes
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/create-quiz")}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl flex items-center gap-2 font-medium transition-all duration-200 shadow"
            disabled={loading}
          >
            <HiPlus className="text-xl" />
            Create Quiz
          </motion.button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
      >
        <motion.div
          whileHover={{
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl shadow-md"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              <HiDocumentText className="w-8 h-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">Total Quizzes</p>
              <h3 className="text-2xl font-bold text-blue-900">
                {statistics.total}
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl shadow-md"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-green-500 to-teal-500 text-white">
              <HiCheck className="w-8 h-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">
                Published Quizzes
              </p>
              <h3 className="text-2xl font-bold text-blue-900">
                {statistics.active}
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl shadow-md"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-white">
              <HiX className="w-8 h-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">
                Unpublished Quizzes
              </p>
              <h3 className="text-2xl font-bold text-blue-900">
                {statistics.inactive}
              </h3>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Action Button Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col sm:flex-row justify-between items-center"
      >
        <div className="mb-4 sm:mb-0">
          <h2 className="text-xl font-bold text-blue-900">
            {loading
              ? "Loading quizzes..."
              : `${statistics.total} Quiz${
                  statistics.total === 1 ? "" : "zes"
                } Found`}
          </h2>
          <p className="text-sm text-gray-500">
            {statistics.active} published, {statistics.inactive} unpublished
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchQuizzes}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            disabled={loading}
          >
            <HiRefresh className="text-xl" />
            Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg text-red-700"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <HiX className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Table Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-6 mb-6 flex-1 overflow-x-auto"
      >
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Spinner size="xl" color="purple" />
          </div>
        ) : quizzes.length > 0 ? (
          <Table hoverable className="min-w-full">
            <Table.Head className="bg-gradient-to-r from-blue-50 to-purple-50">
              <Table.HeadCell className="text-blue-900">
                Creation Date
              </Table.HeadCell>
              <Table.HeadCell className="text-blue-900">Title</Table.HeadCell>
              <Table.HeadCell className="text-blue-900">Price</Table.HeadCell>
              <Table.HeadCell className="text-blue-900">
                Discount
              </Table.HeadCell>
              <Table.HeadCell className="text-blue-900">Status</Table.HeadCell>
              <Table.HeadCell className="text-blue-900">Chapter</Table.HeadCell>
              <Table.HeadCell className="text-blue-900">Subject</Table.HeadCell>
              <Table.HeadCell className="text-blue-900">Exam</Table.HeadCell>
              <Table.HeadCell className="text-blue-900">Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {quizzes.map((quiz) => (
                <Table.Row
                  key={quiz._id}
                  className="hover:bg-purple-50 transition-colors"
                >
                  <Table.Cell>
                    {new Date(quiz.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className="font-medium">{quiz.title}</Table.Cell>
                  <Table.Cell>
                    Rs {quiz.chapterId?.subject?.exam?.price || "N/A"}
                  </Table.Cell>
                  <Table.Cell>
                    Rs {quiz.chapterId?.subject?.exam?.discount || "N/A"}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      color={quiz.isPublished ? "success" : "gray"}
                      className="px-3 py-1.5"
                    >
                      {quiz.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{quiz.chapterId?.name || "N/A"}</Table.Cell>
                  <Table.Cell>
                    {quiz.chapterId?.subject?.name || "N/A"}
                  </Table.Cell>
                  <Table.Cell>
                    {quiz.chapterId?.subject?.exam?.name || "N/A"}
                  </Table.Cell>
                  <Table.Cell className="space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openModal(quiz)}
                      className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <HiPencilAlt className="mr-1.5" />
                      Edit
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleTogglePublishStatus(quiz._id, quiz.isPublished)
                      }
                      className={`inline-flex items-center px-3 py-1.5 ${
                        quiz.isPublished
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                          : "bg-gradient-to-r from-green-600 to-teal-600"
                      } text-white text-xs font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200`}
                    >
                      {quiz.isPublished ? (
                        <>
                          <HiOutlineEyeOff className="mr-1.5" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <HiOutlineEye className="mr-1.5" />
                          Publish
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteQuiz(quiz._id)}
                      className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <HiTrash className="mr-1.5" />
                      Delete
                    </motion.button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl border-2 border-dashed border-blue-200 p-8 text-center"
          >
            <HiOutlineDocumentText className="mx-auto h-12 w-12 text-blue-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No quizzes found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new quiz
            </p>
            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/create-quiz")}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 inline-flex items-center"
              >
                <HiPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Quiz
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Edit Quiz Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        size="xl"
        className="!bg-blue-900/20 backdrop-blur-sm"
      >
        <Modal.Header className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white border-none">
          <span className="text-xl font-bold">
            {isEdit ? "Edit Quiz" : "Add Quiz"}
          </span>
        </Modal.Header>
        <Modal.Body className="bg-white space-y-6 overflow-y-auto max-h-[70vh] p-6">
          <div className="space-y-4">
            <div>
              <label className="text-blue-900 font-medium">Quiz Title</label>
              <TextInput
                name="title"
                placeholder="Quiz Title"
                value={quizData.title || ""}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-blue-900 font-medium">Chapter ID</label>
              <TextInput
                name="chapterId"
                placeholder="Chapter ID"
                value={quizData.chapterId?._id || quizData.chapterId || ""}
                onChange={handleInputChange}
                className="mt-1"
                disabled={isEdit}
              />
              <p className="text-xs text-gray-500 mt-1">
                Current chapter: {quizData.chapterId?.name || "None"}
              </p>
            </div>

            <div>
              <p className="text-blue-900 font-medium mb-2">Quiz Questions</p>
              <p className="text-sm text-gray-600">
                This quiz has {quizData.questions?.length || 0} questions. To
                edit questions, use the dedicated question editor.
              </p>
            </div>

            <div className="pt-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={quizData.isPublished}
                  onChange={(e) => handleTogglePublish(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900"></div>
                <span className="ms-3 text-sm font-medium text-gray-900">
                  {quizData.isPublished ? "Published" : "Draft"}
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                {quizData.isPublished
                  ? "Quiz is visible to users"
                  : "Quiz is hidden from users"}
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(false)}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-200"
              disabled={modalLoading}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpdateQuiz}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
              disabled={modalLoading}
            >
              {modalLoading ? (
                <Spinner size="sm" color="white" className="mr-2" />
              ) : null}
              {isEdit ? "Update Quiz" : "Add Quiz"}
            </motion.button>
          </div>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
};

export default AdminQuizDashboard;
