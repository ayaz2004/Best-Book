import { useState, useEffect } from "react";
import { Table, Button, Modal, TextInput, Label, Alert } from "flowbite-react";
import { HiPlus, HiPencilAlt, HiTrash, HiEye } from "react-icons/hi";

const initialBookData = {
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
  bookImages: [],
  author: "",
  publisher: "",
  publicationDate: "",
  ISBN: "",
  category: "",
  language: "",
  pages: "",
  // rating: 0,
};

const AdminBookDashboard = () => {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [bookData, setBookData] = useState(initialBookData);

  // Fetch books from the server
  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/book/admin/getbook");
      if (!response.ok) throw new Error("Failed to fetch books.");
      const data = await response.json();
      setBooks(data.books);
    } catch (error) {
      setError(error.message);
      setShowAlert(true);
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
    const { name, files } = e.target;
    if (name === "bookImages") {
      if (files.length > 4) {
        alert("Maximum 4 images allowed");
        setShowAlert(true);
        return;
      }
      setBookData((prev) => ({
        ...prev,
        [name]: Array.from(files),
      }));
    } else {
      setBookData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const validateBookData = () => {
    const requiredFields = [
      "title",
      "author",
      "ISBN",
      "price",
      "stock",
      "description",
      "publisher",
      "language",
      "pages",
      "category",
      "targetExam",
      "publicationDate",
    ];

    for (const field of requiredFields) {
      if (!bookData[field]) {
        setError(
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        );
        setShowAlert(true);
        return false;
      }
    }

    if (bookData.isEbookAvailable && !bookData.eBook && !isEdit) {
      setError("Please upload an eBook file");
      setShowAlert(true);
      return false;
    }

    if (!bookData.coverImage && !isEdit) {
      setError("Cover image is required");
      setShowAlert(true);
      return false;
    }

    return true;
  };

  const handleAddEditBook = async () => {
    if (!validateBookData()) return;

    setLoading(true);
    const formData = new FormData();

    // Append all text fields
    Object.keys(bookData).forEach((key) => {
      if (key !== "coverImage" && key !== "eBook" && key !== "bookImages") {
        formData.append(key, bookData[key]);
      }
    });

    // Append files
    if (bookData.coverImage) {
      formData.append("coverImage", bookData.coverImage);
    }

    if (bookData.isEbookAvailable && bookData.eBook) {
      formData.append("eBook", bookData.eBook);
    }

    if (bookData.bookImages?.length > 0) {
      bookData.bookImages.forEach((image) => {
        formData.append("bookImages", image);
      });
    }

    try {
      const url = isEdit
        ? `/api/book/admin/updatebook/${bookData._id}`
        : "/api/book/admin/uploadbook";

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to save book");

      setShowModal(false);
      fetchBooks();
      setBookData(initialBookData);
    } catch (error) {
      setError(error.message);
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/book/admin/deletebook/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete book.");
      fetchBooks();
    } catch (error) {
      setError(error.message);
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (book = null) => {
    setIsEdit(!!book);
    setBookData(book || initialBookData);
    setShowModal(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#A28DED]  p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {showAlert && (
        <Alert
          color="failure"
          onDismiss={() => setShowAlert(false)}
          className="fixed top-4 right-4 z-50"
        >
          <span className="font-medium">Error!</span> {error}
        </Alert>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
          Admin Dashboard - Manage Books
        </h1>
        <Button
          onClick={() => openModal()}
          className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600"
          disabled={loading}
        >
          <HiPlus className="mr-2" />
          Add New Book
        </Button>
      </div>
      {/* Books Table */}
      <div className="bg-slate-800 rounded-2xl shadow-xl p-6">
        <Table className="bg-transparent">
          <Table.Head>
            <Table.HeadCell className="text-purple-700">
              Book Details
            </Table.HeadCell>
            <Table.HeadCell className="text-purple-700">
              Price & Stock
            </Table.HeadCell>
            <Table.HeadCell className="text-purple-700">
              Target Exam
            </Table.HeadCell>
            <Table.HeadCell className="text-purple-700">Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {books.map((book) => (
              <Table.Row
                key={book._id}
                className="border-gray-700 bg-slate-700/50"
              >
                <Table.Cell className="flex items-center space-x-4">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-16 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <p className="text-white font-medium">{book.title}</p>
                    <p className="text-gray-400 text-sm">{book.author}</p>
                    <p className="text-gray-500 text-xs">
                      Added: {new Date(book.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="space-y-1">
                    <p className="text-white">₹{book.price}</p>
                    {book.hardcopyDiscount > 0 && (
                      <p className="text-green-400 text-sm">
                        hardcopy: -{book.hardcopyDiscount}% off
                        <span className="ml-2">
                          ₹
                          {(
                            book.price -
                            (book.price * book.hardcopyDiscount) / 100
                          ).toFixed(2)}
                        </span>
                      </p>
                    )}
                    {book.isEbookAvailable && book.ebookDiscount > 0 && (
                      <p className="text-blue-400 text-sm">
                        eBook: -{book.ebookDiscount}% off
                        <span className="ml-2">
                          ₹
                          {(
                            book.price -
                            (book.price * book.ebookDiscount) / 100
                          ).toFixed(2)}
                        </span>
                      </p>
                    )}
                    <p className="text-gray-400 text-sm">Stock: {book.stock}</p>
                  </div>
                </Table.Cell>
                <Table.Cell className="text-white">
                  {book.targetExam}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-purple-600"
                      onClick={() => openModal(book)}
                    >
                      <HiPencilAlt className="mr-1" />
                      Edit
                    </Button>
                    {book.isEbookAvailable && book.eBook && (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-blue-600"
                        onClick={() => window.open(book.eBook, "_blank")}
                      >
                        <HiEye className="mr-1" />
                        View
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-red-500 to-red-600"
                      onClick={() => handleDeleteBook(book._id)}
                    >
                      <HiTrash className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      {/* Add/Edit Book Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="xl">
        <Modal.Header className="bg-slate-800 text-white border-b border-gray-700">
          {isEdit ? "Edit Book" : "Add New Book"}
        </Modal.Header>
        <Modal.Body className="bg-slate-800 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Basic Info Section */}
            <div className="col-span-2 bg-slate-700/50 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  name="title"
                  placeholder="Book Title"
                  value={bookData.title || ""}
                  onChange={handleInputChange}
                  className="bg-slate-600 text-white"
                  required
                />
                <TextInput
                  name="author"
                  placeholder="Author"
                  value={bookData.author || ""}
                  onChange={handleInputChange}
                  className="bg-slate-600 text-white"
                  required
                />
                <TextInput
                  name="ISBN"
                  placeholder="ISBN"
                  value={bookData.ISBN || ""}
                  onChange={handleInputChange}
                  className="bg-slate-600 text-white"
                  required
                />
                <TextInput
                  name="publisher"
                  placeholder="Publisher"
                  value={bookData.publisher || ""}
                  onChange={handleInputChange}
                  className="bg-slate-600 text-white"
                  required
                />
                <TextInput
                  name="language"
                  placeholder="Language"
                  value={bookData.language || ""}
                  onChange={handleInputChange}
                  className="bg-slate-600 text-white"
                  required
                />
                <TextInput
                  name="pages"
                  placeholder="Number of Pages"
                  type="number"
                  value={bookData.pages || ""}
                  onChange={handleInputChange}
                  className="bg-slate-600 text-white"
                  required
                />
                <TextInput
                  name="category"
                  placeholder="Category"
                  value={bookData.category || ""}
                  onChange={handleInputChange}
                  className="bg-slate-600 text-white"
                  required
                />
                <TextInput
                  name="targetExam"
                  placeholder="Target Exam"
                  value={bookData.targetExam || ""}
                  onChange={handleInputChange}
                  className="bg-slate-600 text-white"
                  required
                />
                <div className="col-span-2">
                  <TextInput
                    name="publicationDate"
                    type="date"
                    placeholder="Publication Date"
                    value={
                      bookData.publicationDate
                        ? new Date(bookData.publicationDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleInputChange}
                    className="bg-slate-600 text-white"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-gray-300 mb-2">Description</Label>
                  <textarea
                    name="description"
                    placeholder="Book Description"
                    value={bookData.description || ""}
                    onChange={handleInputChange}
                    className="w-full bg-slate-600 text-white rounded-lg p-2.5"
                    rows="4"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="col-span-1 bg-slate-700/50 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-4">Pricing & Stock</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Price & Stock</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <TextInput
                      name="price"
                      placeholder="Price"
                      type="number"
                      value={bookData.price || ""}
                      onChange={handleInputChange}
                    />
                    <TextInput
                      name="stock"
                      placeholder="Stock"
                      type="number"
                      value={bookData.stock || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Discounts</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <TextInput
                      name="hardcopyDiscount"
                      placeholder="Hardcopy Discount %"
                      type="number"
                      value={bookData.hardcopyDiscount || ""}
                      onChange={handleInputChange}
                    />
                    {bookData.isEbookAvailable && (
                      <TextInput
                        name="ebookDiscount"
                        placeholder="eBook Discount %"
                        type="number"
                        value={bookData.ebookDiscount || ""}
                        onChange={handleInputChange}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="col-span-1 bg-slate-700/50 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-4">Images</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Cover Image</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      name="coverImage"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="text-gray-300"
                    />
                    {bookData.coverImage && (
                      <img
                        src={
                          typeof bookData.coverImage === "string"
                            ? bookData.coverImage
                            : URL.createObjectURL(bookData.coverImage)
                        }
                        alt="Cover Preview"
                        className="w-16 h-20 object-cover rounded"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">
                    Additional Images (Max 4)
                  </Label>
                  <input
                    type="file"
                    name="bookImages"
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    max="4"
                    className="text-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* eBook Section */}
            <div className="col-span-2 bg-slate-700/50 p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <Label className="text-gray-300">
                  <input
                    type="checkbox"
                    name="isEbookAvailable"
                    checked={bookData.isEbookAvailable || false}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  eBook Available
                </Label>
                {bookData.isEbookAvailable && (
                  <div className="flex-1">
                    <input
                      type="file"
                      name="eBook"
                      onChange={handleFileChange}
                      accept="application/pdf"
                      className="text-gray-300"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-slate-800 border-t border-gray-700">
          <Button
            onClick={handleAddEditBook}
            className="bg-gradient-to-r from-purple-500 to-purple-600"
          >
            {isEdit ? "Update Book" : "Add Book"}
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
