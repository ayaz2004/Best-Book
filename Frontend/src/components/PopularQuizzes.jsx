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

export default function PopularQuizzes() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("/api/quizzes/popularQuizzes");
        if (!response.ok) throw new Error("Failed to fetch popular quizzes.");
        const data = await response.json();
        setQuizzes(data.quizzes);
      } catch (error) {
        console.error("Error fetching popular quizzes:", error);
      }
    };

    fetchQuizzes();
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
      className="py-10"
      variants={fadeIn(0.4, "up")}
      initial="hidden"
      whileInView={"show"}
      viewport={{ once: false, amount: 0.2 }}
    >
      <h2 className="text-2xl font-bold mb-4 p-4">Popular Quizzes</h2>
      <Slider {...settings}>
        {quizzes.map((quiz, index) => (
          <div
            key={quiz._id}
            className="p-4"
            variants={fadeIn((index * 0.1 + 0.3) % 0.5, "up", "tween")}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.2 }}
          >
            <div
              className="bg-white p-4 rounded shadow"
              style={{
                backgroundColor: getRandomLightColor(),
                textAlign: "center",
              }}
            >
              <h3 className="text-lg font-semibold">{quiz.title}</h3>
              <p>Exam: {quiz.chapterId?.subject?.exam?.name || "N/A"}</p>
              <p>Subject: {quiz.chapterId?.subject?.name || "N/A"}</p>
              <p>Chapter: {quiz.chapterId?.name || "N/A"}</p>
            </div>
          </div>
        ))}
      </Slider>
      <div className="mt-4 text-right">
        <Link to="/all-quizzes">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            See More
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
