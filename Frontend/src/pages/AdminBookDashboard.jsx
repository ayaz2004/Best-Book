import { useState, useEffect } from "react";
import { Modal, Alert } from "flowbite-react";
import { HiPlus, HiLibrary } from "react-icons/hi";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-purple-50 p-4 sm:p-6 md:p-8 flex flex-col"
    >
      {/* Alert Component */}
      {showAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Alert
            color="failure"
            onDismiss={() => setShowAlert(false)}
            className="fixed top-4 right-4 z-50 border-2 border-purple-200 bg-purple-50 text-purple-700 rounded-xl shadow-lg"
          >
            <span className="font-medium">Error!</span> {error}
          </Alert>
        </motion.div>
      )}

      {/* Header Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-800 text-white p-6 rounded-2xl shadow-xl mb-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <HiLibrary className="text-3xl" />
            <h1 className="text-2xl md:text-3xl font-bold">
              Admin Dashboard - Manage Books
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal()}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl flex items-center gap-2 font-medium transition-all duration-200 shadow"
            disabled={loading}
          >
            <HiPlus className="text-xl" />
            Add New Book
          </motion.button>
        </div>
      </motion.div>

      {/* Book Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 overflow-hidden mb-6 flex-1"
      >
        <BookTable
          books={books}
          onEdit={openModal}
          onDelete={handleDeleteBook}
        />
      </motion.div>

      {/* Add/Edit Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        size="xl"
        className="!bg-blue-900/20 backdrop-blur-sm"
      >
        <Modal.Header className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white border-none">
          <span className="text-xl font-bold">
            {isEdit ? "Edit Book" : "Add New Book"}
          </span>
        </Modal.Header>
        <Modal.Body className="bg-white space-y-6 overflow-y-auto max-h-[70vh] p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="lg:col-span-2"
            >
              <BookForm
                bookData={bookData}
                handleInputChange={handleInputChange}
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <PricingSection
                bookData={bookData}
                handleInputChange={handleInputChange}
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <ImageUploadSection
                bookData={bookData}
                setBookData={setBookData}
                handleFileChange={handleFileChange}
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="lg:col-span-2"
            >
              <EbookSection
                bookData={bookData}
                handleInputChange={handleInputChange}
                handleFileChange={handleFileChange}
              />
            </motion.div>
          </div>
        </Modal.Body>

        <Modal.Footer className="bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(false)}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddEditBook}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
              disabled={loading}
            >
              {isEdit ? "Update Book" : "Add Book"}
            </motion.button>
          </div>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
};

export default AdminBookDashboard;
