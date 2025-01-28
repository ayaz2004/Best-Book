import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

export default function AllBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
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

    fetchBooks();
  }, []);

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount) / 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-purple-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-purple-600">All Books</span>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <Link to={`/book/${book._id}`}>
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-64 object-cover"
                />
              </Link>
              <div className="p-4">
                <Link to={`/book/${book._id}`}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {book.title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 mb-2">By {book.author}</p>

                {/* Hardcopy Price */}
                <div className="flex items-baseline mb-2">
                  <span className="text-xl font-bold text-purple-600">
                    ₹
                    {calculateDiscountedPrice(
                      book.price,
                      book.hardcopyDiscount
                    ).toFixed(2)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ₹{book.price}
                  </span>
                  <span className="ml-2 text-sm text-green-500">
                    ({book.hardcopyDiscount}% off)
                  </span>
                </div>

                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors flex items-center justify-center">
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
