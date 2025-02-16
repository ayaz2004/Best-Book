import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { handleSessionExpired } from "../redux/user/userSlice";

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

export const authenticatedFetch = async (url, options = {}, dispatch) => {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    if (error.message === "UNAUTHORIZED") {
      dispatch(handleSessionExpired());
      window.location.href = "/sign-in";
    }
    throw error;
  }
};

export default function RecommendedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      if (!currentUser?.targetExam) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await authenticatedFetch(
          `/api/book/getbookbyexam/${currentUser.targetExam}`,
          {},
          dispatch
        );
        setBooks(data.books || []);
      } catch (error) {
        console.error("Failed to fetch recommended books:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedBooks();
  }, [currentUser?.targetExam, dispatch]);

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

  if (!currentUser) return null;
  if (loading) {
    return (
      <div className="py-10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
      </div>
    );
  }
  if (error) return null;
  if (books.length === 0) return null;

  return (
    <div className="py-10 w-full">
      <h2 className="text-2xl font-bold mb-4">
        Recommended Books for {currentUser.targetExam}
      </h2>
      <Slider {...settings}>
        {books.map((book) => (
          <div key={book._id} className="p-4">
            <Link to={`/book/${book._id}`}>
              <div
                className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow"
                style={{ backgroundColor: getRandomLightColor() }}
              >
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-64 object-cover mb-4"
                />
                <h3 className="text-lg font-semibold text-center truncate">
                  {book.title}
                </h3>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
      <div className="mt-4 text-right">
        <Link to="/all-books">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            See More
          </button>
        </Link>
      </div>
    </div>
  );
}
