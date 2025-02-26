import { useState, useEffect } from "react";
import { Button, Modal, Alert } from "flowbite-react";
import { HiPlus } from "react-icons/hi";

import BookTable from "../components/admin/book/BookTable";
import BookForm from "../components/admin/book/BookForm";
import PricingSection from "../components/admin/book/PricingSection";
import ImageUploadSection from "../components/admin/book/ImageUploadSection";
import EbookSection from "../components/admin/book/EbookSection";

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

  useEffect(() => {
    if (!showModal) {
      // Cleanup preview URLs when modal closes
      if (bookData.coverImage?.preview) {
        URL.revokeObjectURL(bookData.coverImage.preview);
      }
      if (bookData.bookImages?.length > 0) {
        bookData.bookImages.forEach((image) => {
          if (image.preview) {
            URL.revokeObjectURL(image.preview);
          }
        });
      }
      // Reset form data when modal closes
      if (!isEdit) {
        setBookData(initialBookData);
      }
    }
  }, [showModal, isEdit]);

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
      // Handle multiple images
      if (files.length > 4) {
        setError("Maximum 4 images allowed");
        setShowAlert(true);
        return;
      }

      // Create array of files with previews
      const newImages = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setBookData((prev) => ({
        ...prev,
        bookImages: [...(prev.bookImages || []), ...newImages].slice(0, 4),
      }));
    } else if (name === "coverImage" || name === "eBook") {
      // Handle single file (cover image or eBook)
      if (files[0]) {
        const file = files[0];
        if (name === "coverImage") {
          // For cover image, store both file and preview
          setBookData((prev) => ({
            ...prev,
            coverImage: {
              file,
              preview: URL.createObjectURL(file),
            },
          }));
        } else {
          // For eBook, just store the file
          setBookData((prev) => ({
            ...prev,
            [name]: file,
          }));
        }
      }
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
      formData.append(
        "coverImage",
        bookData.coverImage.file || bookData.coverImage
      );
    }

    if (bookData.isEbookAvailable && bookData.eBook) {
      formData.append("eBook", bookData.eBook);
    }

    if (bookData.bookImages?.length > 0) {
      bookData.bookImages.forEach((image) => {
        formData.append("bookImages", image.file || image);
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
    <div className="w-full min-h-screen bg-[#A28DED] p-2 sm:p-4 md:p-6 space-y-4">
      {/* Alert Component */}
      {showAlert && (
        <Alert
          color="failure"
          onDismiss={() => setShowAlert(false)}
          className="fixed top-4 right-4 z-50"
        >
          <span className="font-medium">Error!</span> {error}
        </Alert>
      )}

      {/* Header Section */}
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

      {/* Book Table */}
      <BookTable books={books} onEdit={openModal} onDelete={handleDeleteBook} />

      {/* Add/Edit Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="xl">
        <Modal.Header className="bg-slate-800 text-white border-b border-gray-700">
          {isEdit ? "Edit Book" : "Add New Book"}
        </Modal.Header>
        <Modal.Body className="bg-slate-800 space-y-6 overflow-y-auto max-h-[70vh] p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BookForm
              bookData={bookData}
              handleInputChange={handleInputChange}
            />
            <PricingSection
              bookData={bookData}
              handleInputChange={handleInputChange}
            />
            <ImageUploadSection
              bookData={bookData}
              setBookData={setBookData}
              handleFileChange={handleFileChange}
            />
            <EbookSection
              bookData={bookData}
              handleInputChange={handleInputChange}
              handleFileChange={handleFileChange}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-slate-800 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              onClick={handleAddEditBook}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-purple-600"
            >
              {isEdit ? "Update Book" : "Add Book"}
            </Button>
            <Button
              color="gray"
              onClick={() => setShowModal(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminBookDashboard;
