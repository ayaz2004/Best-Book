import { useState, useEffect } from "react";
import { Table, Button, Modal, TextInput } from "flowbite-react";
import { HiPlus, HiPencilAlt, HiTrash } from "react-icons/hi";

const AdminBookDashboard = () => {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [bookData, setBookData] = useState({
    stock: "",
    ebookDiscount: "",
    isEbookAvailable: false,
    price: "",
    hardcopyDiscount: "",
    description: "",
    title: "",
    targetExam: "",
    coverImage: null,
    eBook: null,
    author: "",
    publisher: "",
    publicationDate: "",
    ISBN: "",
    category: "",
    language: "",
    pages: "",
  });

  // Fetch books from the server
  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/book/admin/getbook");
      if (!response.ok) throw new Error("Failed to fetch books.");
      const data = await response.json();
      setBooks(data.books);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookData({
      ...bookData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    setBookData({
      ...bookData,
      [name]: e.target.files[0],
    });
  };

  const handleAddEditBook = async () => {
    const formData = new FormData();
    for (const key in bookData) {
      formData.append(key, bookData[key]);
    }
    try {
      const url = isEdit
        ? `/api/book/admin/updatebook/${bookData._id}`
        : "/api/book/admin/uploadbook";
      const method = isEdit ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to add/update book.");
      }
      setShowModal(false);
      fetchBooks();
    } catch (error) {
      console.error("Error adding/updating book:", error);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      const response = await fetch(`/api/book/admin/deletebook/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete book.");
      }
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const openModal = (book = null) => {
    setIsEdit(!!book);
    setBookData(
      book || {
        stock: "",
        ebookDiscount: "",
        isEbookAvailable: false,
        price: "",
        hardcopyDiscount: "",
        description: "",
        title: "",
        targetExam: "",
        coverImage: null,
        eBook: null,
        author: "",
        publisher: "",
        publicationDate: "",
        ISBN: "",
        category: "",
        language: "",
        pages: "",
      }
    );
    setShowModal(true);
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Admin Dashboard - Manage Books</h1>
        <Button onClick={() => openModal()} gradientDuoTone="greenToBlue">
          <HiPlus className="mr-2" />
          Add Book
        </Button>
      </div>
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Creation Date</Table.HeadCell>
          <Table.HeadCell>Title</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>Stock</Table.HeadCell>
          <Table.HeadCell>Target Exam</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {books.map((book) => (
            <Table.Row key={book._id}>
              <Table.Cell>
                {new Date(book.createdAt).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell>
                <img
                  src={book.coverImage}
                  alt={book.title}
                  style={{ width: "50px", height: "50px", marginRight: "10px" }}
                />
                {book.title}
              </Table.Cell>
              <Table.Cell>Rs {book.price}</Table.Cell>
              <Table.Cell>{book.stock}</Table.Cell>
              <Table.Cell>{book.targetExam}</Table.Cell>
              <Table.Cell>
                <Button
                  onClick={() => openModal(book)}
                  size="xs"
                  gradientDuoTone="purpleToBlue"
                >
                  <HiPencilAlt className="mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteBook(book._id)}
                  size="xs"
                  gradientDuoTone="redToPink"
                  className="ml-2"
                >
                  <HiTrash className="mr-2" />
                  Delete
                </Button>
                {book.eBook && (
                  <Button
                    onClick={() => window.open(book.eBook, "_blank")}
                    size="xs"
                    gradientDuoTone="blueToGreen"
                    className="ml-2"
                  >
                    View PDF
                  </Button>
                )}
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
        <Modal.Header>{isEdit ? "Edit Book" : "Add Book"}</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <TextInput
              name="title"
              placeholder="Title"
              value={bookData.title || ""}
              onChange={handleInputChange}
            />
            <TextInput
              name="price"
              placeholder="Price"
              value={bookData.price || ""}
              onChange={handleInputChange}
              type="number"
            />
            <TextInput
              name="stock"
              placeholder="Stock"
              value={bookData.stock || ""}
              onChange={handleInputChange}
              type="number"
            />
            <TextInput
              name="targetExam"
              placeholder="Target Exam"
              value={bookData.targetExam || ""}
              onChange={handleInputChange}
            />
            <TextInput
              name="ebookDiscount"
              placeholder="eBook Discount"
              value={bookData.ebookDiscount || ""}
              onChange={handleInputChange}
              type="number"
            />
            <TextInput
              name="hardcopyDiscount"
              placeholder="Hardcopy Discount"
              value={bookData.hardcopyDiscount || ""}
              onChange={handleInputChange}
              type="number"
            />
            <TextInput
              name="author"
              placeholder="Author"
              value={bookData.author || ""}
              onChange={handleInputChange}
            />
            <TextInput
              name="publisher"
              placeholder="Publisher"
              value={bookData.publisher || ""}
              onChange={handleInputChange}
            />
            <TextInput
              name="publicationDate"
              placeholder="Publication Date"
              value={bookData.publicationDate || ""}
              onChange={handleInputChange}
              type="date"
            />
            <TextInput
              name="ISBN"
              placeholder="ISBN"
              value={bookData.ISBN || ""}
              onChange={handleInputChange}
            />
            <TextInput
              name="category"
              placeholder="Category"
              value={bookData.category || ""}
              onChange={handleInputChange}
            />
            <TextInput
              name="language"
              placeholder="Language"
              value={bookData.language || ""}
              onChange={handleInputChange}
            />
            <TextInput
              name="pages"
              placeholder="Pages"
              value={bookData.pages || ""}
              onChange={handleInputChange}
              type="number"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={bookData.description || ""}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            ></textarea>
            <div>
              <label>Cover Image</label>
              <input
                type="file"
                name="coverImage"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
            <div>
              <label>eBook File</label>
              <input
                type="file"
                name="eBook"
                onChange={handleFileChange}
                accept="application/pdf"
              />
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="isEbookAvailable"
                  checked={bookData.isEbookAvailable || false}
                  onChange={handleInputChange}
                />
                eBook Available
              </label>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAddEditBook}>
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

export default AdminBookDashboard;
