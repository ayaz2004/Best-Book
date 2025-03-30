import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReviewCard from "./admin/userAnalytics/ReviewCard";

export default function BookReviewSection({ bookId }) {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 0, description: "" });
  const [showForm, setShowForm] = useState(false);
  console.log("currentuser",currentUser)
  useEffect(() => {
    fetchReviews();
  }, [bookId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reviews/approvereview`);
      const data = await response.json();
      if (response.ok) {
        // Filter reviews for current book and take latest 5
        const bookReviews = data.reviews
          .filter((review) => review.itemId === bookId)
          .slice(0, 5);
        setReviews(bookReviews);
      }
    } catch (error) {
      setError("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    try {
      const response = await fetch("/api/reviews/addreviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: currentUser.username,
          description: newReview.description,
          rating: newReview.rating,
          itemType: "Book",
          itemId: bookId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setNewReview({ rating: 0, description: "" });
        setShowForm(false);
        fetchReviews();
      }
    } catch (error) {
      setError("Failed to submit review");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-96 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Customer Reviews</h3>
        {!showForm && (
          <button
            onClick={() =>
              currentUser ? setShowForm(true) : navigate("/sign-in")
            }
            className="text-purple-600 hover:text-purple-700"
          >
            Write a Review
          </button>
        )}
      </div>

      {error && <div className="text-red-500 text-center py-2">{error}</div>}

      {showForm && (
        <form
          onSubmit={handleSubmitReview}
          className="bg-gray-50 p-4 rounded-lg"
        >
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                >
                  <FaStar
                    className={`w-6 h-6 ${
                      star <= newReview.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={newReview.description}
            onChange={(e) =>
              setNewReview({ ...newReview, description: e.target.value })
            }
            className="w-full p-2 border rounded-lg"
            placeholder="Write your review..."
            rows="4"
            required
          />
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Submit Review
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-center text-gray-500">No approved reviews yet</p>
        ) : (
          reviews.map((review) => (
            // <div key={review._id} className="border-b pb-4">
            //   <div className="flex items-center justify-between">
            //     <div className="flex items-center space-x-2">
            //       <span className="font-medium">{review.username}</span>
            //     </div>
            //     <div className="flex text-yellow-400">
            //       {[...Array(5)].map((_, index) => (
            //         <FaStar
            //           key={index}
            //           className={`w-4 h-4 ${
            //             index < review.rating
            //               ? "text-yellow-400"
            //               : "text-gray-300"
            //           }`}
            //         />
            //       ))}
            //     </div>
            //   </div>
            //   <p className="mt-2 text-gray-600">{review.description}</p>
            //   <span className="text-sm text-gray-500">
            //     {new Date(review.createdAt).toLocaleDateString()}
            //   </span>
            // </div>
            <ReviewCard onApprove onDisapprove username ={currentUser.username} review={review} isPending={false} key={review._id} theme="light"/>

          ))
        )}
      </div>


    </div>
  );
}
