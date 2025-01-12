import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "rgba(0, 0, 0, 0.5)",
        borderRadius: "50%",
        right: "10px",
        zIndex: 1,
      }}
      onClick={onClick}
    >
      <i
        className="fas fa-chevron-right"
        style={{ color: "white", padding: "10px" }}
      ></i>
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
        background: "rgba(0, 0, 0, 0.5)",
        borderRadius: "50%",
        left: "10px",
        zIndex: 1,
      }}
      onClick={onClick}
    >
      <i
        className="fas fa-chevron-left"
        style={{ color: "white", padding: "10px" }}
      ></i>
    </div>
  );
}

function getRandomLightColor() {
  const colors = [
    "#FFB6C1",
    "#FFDAB9",
    "#E6E6FA",
    "#FFFACD",
    "#E0FFFF",
    "#F0FFF0",
    "#F5F5DC",
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
    <div className="py-10">
      <h2 className="text-2xl font-bold mb-4">Popular Books</h2>
      <Slider {...settings}>
        {books.map((book) => (
          <div key={book._id} className="p-4">
            <div
              className="bg-white p-4 rounded shadow"
              style={{ backgroundColor: getRandomLightColor() }}
            >
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-64 object-cover mb-4"
              />
              <h3 className="text-lg font-semibold text-center">
                {book.title}
              </h3>
            </div>
          </div>
        ))}
      </Slider>
      <div className="mt-4 text-right">
        <Link to="/all-books">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            See More
          </button>
        </Link>
      </div>
    </div>
  );
}
