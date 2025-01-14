import React, { useState, useEffect } from "react";
import { Table, Button, Modal, TextInput } from "flowbite-react";
import { HiPlus, HiPencilAlt, HiTrash } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const AdminQuizDashboard = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [quizData, setQuizData] = useState({
    title: "",
    chapterId: "",
    questions: [],
  });

  // Fetch quizzes from the server
  const fetchQuizzes = async () => {
    try {
      const response = await fetch("/api/quizzes/getallquizzes");
      if (!response.ok) throw new Error("Failed to fetch quizzes.");
      const data = await response.json();
      setQuizzes(data.quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
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

  const handleDeleteQuiz = async (id) => {
    try {
      const response = await fetch(`/api/quizzes/deletequiz/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete quiz.");
      }
      fetchQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const openModal = (quiz = null) => {
    setIsEdit(!!quiz);
    setQuizData(
      quiz || {
        title: "",
        chapterId: "",
        questions: [],
      }
    );
    setShowModal(true);
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Admin Dashboard - Manage Quizzes</h1>
        <Button
          onClick={() => navigate("/create-quiz")}
          gradientDuoTone="greenToBlue"
        >
          <HiPlus className="mr-2" />
          Create Quiz
        </Button>
      </div>
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Creation Date</Table.HeadCell>
          <Table.HeadCell>Title</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>Discount Price</Table.HeadCell>
          <Table.HeadCell>Chapter</Table.HeadCell>
          <Table.HeadCell>Subject</Table.HeadCell>
          <Table.HeadCell>Exam</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {quizzes.map((quiz) => (
            <Table.Row key={quiz._id}>
              <Table.Cell>
                {new Date(quiz.createdAt).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell>{quiz.title}</Table.Cell>
              <Table.Cell>
                Rs {quiz.chapterId?.subject?.exam?.price || "N/A"}
              </Table.Cell>
              <Table.Cell>
                Rs {quiz.chapterId?.subject?.exam?.discount || "N/A"}
              </Table.Cell>
              <Table.Cell>{quiz.chapterId?.name || "N/A"}</Table.Cell>
              <Table.Cell>{quiz.chapterId?.subject?.name || "N/A"}</Table.Cell>
              <Table.Cell>
                {quiz.chapterId?.subject?.exam?.name || "N/A"}
              </Table.Cell>
              <Table.Cell>
                <Button
                  onClick={() => openModal(quiz)}
                  size="xs"
                  gradientDuoTone="purpleToBlue"
                >
                  <HiPencilAlt className="mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteQuiz(quiz._id)}
                  size="xs"
                  gradientDuoTone="redToPink"
                  className="ml-2"
                >
                  <HiTrash className="mr-2" />
                  Delete
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        size="md"
        popup
      >
        <Modal.Header>{isEdit ? "Edit Quiz" : "Add Quiz"}</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <TextInput
              name="title"
              placeholder="Title"
              value={quizData.title || ""}
              onChange={handleInputChange}
            />
            <TextInput
              name="chapterId"
              placeholder="Chapter ID"
              value={quizData.chapterId || ""}
              onChange={handleInputChange}
            />
            {/* Add more fields as needed */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)}>
            {isEdit ? "Update" : "Add"}
          </Button>
          <Button color="gray" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminQuizDashboard;
