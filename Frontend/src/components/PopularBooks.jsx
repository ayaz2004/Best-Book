import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/Anim/ScrollAnim";
function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "linear-gradient(to right, #1e3a8a, #312e81)",
        borderRadius: "50%",
        right: "10px",
        zIndex: 1,
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClick}
    >
      <i className="fas fa-chevron-right text-white"></i>
    </div>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "linear-gradient(to right, #1e3a8a, #312e81)",
        borderRadius: "50%",
        left: "10px",
        zIndex: 1,
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClick}
    >
      <i className="fas fa-chevron-left text-white"></i>
    </div>
  );
}

// Update the color palette to match theme
function getRandomLightColor() {
  const colors = [
    "bg-purple-50",
    "bg-blue-50",
    "bg-indigo-50",
    "bg-violet-50",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default function PopularBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/book/popularBooks");
        if (!response.ok) throw new Error("Failed to fetch popular books.");
        const data = await response.json();
        setBooks(data.books);
      } catch (error) {
        console.error("Error fetching popular books:", error);
      }
    };

    fetchBooks();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };


  return (
    <motion.div
      className="py-10 px-4 bg-gradient-to-br from-purple-50 to-white"
      variants={fadeIn(0.4, "up")}
      initial="hidden"
      whileInView={"show"}
      viewport={{ once: false, amount: 0.2 }}
    >
      <motion.h2 
        className="text-3xl font-bold mb-8 text-blue-900 text-center"
        variants={fadeIn(0.3, "up")}
      >
        Popular Books
      </motion.h2>
      <Slider {...settings}>
        {books.map((book, index) => (
          <motion.div
            key={book._id}
            className="p-4"
            variants={fadeIn(((index * 0.1) + 0.3) % 0.5, "up", "tween")}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.2 }}
          >
            <Link to={`/book/${book._id}`}>
              <motion.div
                className={`rounded-2xl shadow-lg overflow-hidden hover:shadow-xl 
                  h-full  transition-shadow duration-300 ${getRandomLightColor()}`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-96 object-scale-down align-middle "
                />
                <div className="p-4 align-baseline">
                  <h3 className="text-lg font-semibold text-center text-blue-900 line-clamp-2">
                    {book.title}
                  </h3>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </Slider>
      <div className="mt-8 text-center">
        <Link to="/all-books">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 
                     text-white px-6 py-3 rounded-xl font-medium
                     hover:opacity-95 transition-all duration-200 
                     shadow-lg hover:shadow-xl"
          >
            Explore More Books
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}
