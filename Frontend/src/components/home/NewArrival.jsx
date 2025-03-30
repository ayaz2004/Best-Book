import React, { useEffect, useState } from "react";
import { Spinner } from "../../utils/Loader/Spinner";
import { motion } from "framer-motion";
import library from "../../assets/library.jpg"
export const NewArrivalsGrid = () => {
  const [newBooks, setNewBooks] = useState(null);

  const fetchNewBooks = async () => {
    try {
      const response = await fetch("/api/book/recentlyaddedbooks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        console.log(data.message);
      }
      setNewBooks(data.books);
    } catch (error) {
      console.log("error fetching new books", error.message);
    }
  };

  useEffect(() => {
    fetchNewBooks();
  }, []);

  if (newBooks == null) {
    return <Spinner />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const bookVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount) / 100;
  };

  return (
    <div className="relative w-full my-24">
      {/* Blurred background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${library})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          filter: "blur(8px) brightness(1.1)",
        }}
      ></div>

      {/* Content container with no blur */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full flex justify-center items-center"
      >
        <div className="max-w-6xl w-full px-4">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl font-bold mb-6 text-blue-900 text-center"
          >
            New Arrivals
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-purple-950 max-w-2xl mx-auto text-sm md:text-base"
            >
              Discover our latest collection of educational resources, carefully
              curated to enhance your learning journey
            </motion.p>
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {newBooks.map((book, index) => (
              <motion.div
                key={book.id}
                variants={bookVariants}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center relative my-8"
              >
                <div className="flex flex-col items-center bg-white/80 rounded-lg 
                shadow-lg hover:shadow-xl h-80">
                  {/* Book cover with label */}
                  <motion.div
                    className="relative mb-3 w-48 h-64"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover rounded-t-lg group-hover:shadow-xl duration-300"
                    />
                    {/* New Badge */}
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-900 to-purple-800 text-white text-xs px-2 py-1 rounded-full">
                      New
                    </div>

                    <motion.div
                      className="w-full flex justify-between items-start px-2 mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 * index }}
                    >
                      {/* Book Details - Left Side */}
                      <div className="flex flex-col items-start w-3/4">
                        <h3 className="text-lg font-semibold text-left line-clamp-1">
                          {book.title}
                        </h3>

                        {book.subtitle && (
                          <p className="text-sm text-gray-600 my-1 text-left line-clamp-1">
                            {book.subtitle}
                          </p>
                        )}

                        <p className="text-sm text-gray-600 mb-1 text-left">
                          By {book.author}
                        </p>
                      </div>

                      {/* Price & Discount - Right Side (Stacked) */}
                      <motion.div
                        className="flex flex-col items-end w-1/4"
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="text-xl font-bold text-purple-600">
                          ₹{book.price.toFixed(2)}
                        </span>
                        {book.price > book.hardcopyDiscount && (
                          <span className="text-green-600 text-xs">
                            (
                            {calculateDiscountedPrice(
                              book.price,
                              book.hardcopyDiscount
                            ).toFixed(0)}
                            % off)
                          </span>
                        )}
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
export default NewArrivalsGrid;
