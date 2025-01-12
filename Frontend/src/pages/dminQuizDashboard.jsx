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
    price: "",
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

  const handleAddEditQuiz = async () => {
    const formData = new FormData();
    for (const key in quizData) {
      formData.append(key, quizData[key]);
    }
    try {
      const url = isEdit
        ? `/api/quizzes/updatequiz/${quizData._id}`
        : "/api/quizzes/addquiz";
      const method = isEdit ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to add/update quiz.");
      }
      setShowModal(false);
      fetchQuizzes();
    } catch (error) {
      console.error("Error adding/updating quiz:", error);
    }
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
        price: "",
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
          icon={HiPlus}
          gradientDuoTone="greenToBlue"
        >
          Add Quiz
        </Button>
      </div>
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Title</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>Chapter</Table.HeadCell>
          <Table.HeadCell>Subject</Table.HeadCell>
          <Table.HeadCell>Exam</Table.HeadCell>
          <Table.HeadCell>Creation Date</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {quizzes.map((quiz) => (
            <Table.Row key={quiz._id}>
              <Table.Cell>{quiz.title}</Table.Cell>
              <Table.Cell>${quiz.price}</Table.Cell>
              <Table.Cell>{quiz.chapter.name}</Table.Cell>
              <Table.Cell>{quiz.chapter.subject.name}</Table.Cell>
              <Table.Cell>{quiz.chapter.subject.exam.name}</Table.Cell>
              <Table.Cell>
                {new Date(quiz.createdAt).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell>
                <Button
                  onClick={() => openModal(quiz)}
                  icon={HiPencilAlt}
                  size="xs"
                  gradientDuoTone="purpleToBlue"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteQuiz(quiz._id)}
                  icon={HiTrash}
                  size="xs"
                  gradientDuoTone="redToPink"
                  className="ml-2"
                >
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
              value={quizData.title}
              onChange={handleInputChange}
            />
            <TextInput
              name="price"
              placeholder="Price"
              value={quizData.price}
              onChange={handleInputChange}
              type="number"
            />
            <TextInput
              name="chapterId"
              placeholder="Chapter ID"
              value={quizData.chapterId}
              onChange={handleInputChange}
            />
            {/* Add more fields as needed */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAddEditQuiz}>
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
