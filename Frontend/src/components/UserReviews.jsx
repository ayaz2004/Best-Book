import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard"; // Assuming you have this component
import axios from "axios";

export const UserReviews = ({ userId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await axios.get(`/api/reviews/user/${userId}`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching user reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, [userId]);

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`/api/reviews/${reviewId}`);
      setReviews(reviews.filter(review => review._id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Your Reviews</h2>
      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <ReviewCard 
              key={review._id} 
              review={review} 
              theme="dark" 
              isPending={false}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

