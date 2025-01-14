import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaHeart, FaShare, FaStar, FaShoppingCart } from "react-icons/fa";

export default function BookDetails() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/book/getbookbyid/${bookId}`);
        if (!response.ok) throw new Error("Failed to fetch book details.");
        const data = await response.json();
        setBook(data.book);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBook();
  }, [bookId]);

  if (!book) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const discountedEbookPrice = book.isEbookAvailable
    ? book.price - (book.price * book.ebookDiscount) / 100
    : null;
  const discountedHardcopyPrice =
    book.price - (book.price * book.hardcopyDiscount) / 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-purple-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/books" className="hover:text-purple-600">
            Books
          </Link>
          <span className="mx-2">/</span>
          <span className="text-purple-600">{book.title}</span>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Column - Image Gallery */}
            <div className="lg:w-2/5 p-8 bg-gray-50">
              <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden mb-4">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button className="p-2 rounded-full bg-white shadow hover:shadow-md transition-shadow">
                  <FaHeart className="w-6 h-6 text-red-500" />
                </button>
                <button className="p-2 rounded-full bg-white shadow hover:shadow-md transition-shadow">
                  <FaShare className="w-6 h-6 text-blue-500" />
                </button>
              </div>
            </div>

            {/* Right Column - Book Details */}
            <div className="lg:w-3/5 p-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {book.title}
              </h1>

              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-5 h-5" />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">(4.5/5)</span>
              </div>

              {/* Pricing Cards */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {book.isEbookAvailable && (
                  <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold mb-2">
                      E-Book Version
                    </h3>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-purple-600">
                        ₹{discountedEbookPrice}
                      </span>
                      <span className="ml-2 text-gray-500 line-through">
                        ₹{book.price}
                      </span>
                      <span className="ml-2 text-green-500">
                        ({book.ebookDiscount}% off)
                      </span>
                    </div>
                    <button className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                      <FaShoppingCart className="mr-2" />
                      Add to Cart
                    </button>
                  </div>
                )}

                <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-2">
                    Hardcopy Version
                  </h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-purple-600">
                      ₹{discountedHardcopyPrice}
                    </span>
                    <span className="ml-2 text-gray-500 line-through">
                      ₹{book.price}
                    </span>
                    <span className="ml-2 text-green-500">
                      ({book.hardcopyDiscount}% off)
                    </span>
                  </div>
                  <button className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                    <FaShoppingCart className="mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-8">
                <div className="flex space-x-8">
                  {["Description", "Details", "Reviews"].map((tab) => (
                    <button
                      key={tab}
                      className={`py-4 text-sm font-medium transition-colors hover:text-purple-600 ${
                        activeTab === tab.toLowerCase()
                          ? "text-purple-600 border-b-2 border-purple-600"
                          : "text-gray-500"
                      }`}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === "description" && (
                  <p className="text-gray-600 leading-relaxed">
                    {book.description}
                  </p>
                )}

                {activeTab === "details" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-gray-600">Author</div>
                      <div className="font-medium">{book.author}</div>
                      <div className="text-gray-600">Publisher</div>
                      <div className="font-medium">{book.publisher}</div>
                      <div className="text-gray-600">ISBN</div>
                      <div className="font-medium">{book.ISBN}</div>
                      <div className="text-gray-600">Language</div>
                      <div className="font-medium">{book.language}</div>
                      <div className="text-gray-600">Pages</div>
                      <div className="font-medium">{book.pages}</div>
                      <div className="text-gray-600">Publication Date</div>
                      <div className="font-medium">
                        {new Date(book.publicationDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Customer Reviews
                      </h3>
                      <button className="text-purple-600 hover:text-purple-700">
                        Write a Review
                      </button>
                    </div>
                    {/* Add review components here */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
