import React, { useState, useEffect } from "react";
import { Spinner } from "flowbite-react";
import { CheckCircle } from "lucide-react";
import ReviewCard from "./ReviewCard";
import { motion } from "framer-motion";
function TopReviews() {
  const [popularReviews, setPopularReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularReviews();
  }, []); // Add empty dependency array

  const fetchPopularReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/reviews/approvereview");
      const data = await response.json();
      const sortedReviews = data.reviews
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);
      console.log(sortedReviews);
      setPopularReviews(sortedReviews);
    } catch (error) {
      console.error("Error fetching popular reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Spinner className="h-12 w-12 text-purple-500" />
        </div>
      ) : (
        <div className="w-full bg-gradient-to-br from-slate-800 via-slate-800 to-purple-900 rounded-lg m-2 shadow-xl p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Top Reviews</h2>
            <p className="text-purple-400 text-sm mt-1">
              Check out our top reviews
            </p>
          </div>
          {popularReviews.length > 0 ? (
            <div className="overflow-hidden">
              <motion.div
                className="flex"
                animate={{
                  x: ["0%", "-50%"],
                }}
                transition={{
                  duration: 20,
                  ease: "linear",
                  repeat: Infinity,
                }}
                whileHover={{ animationPlayState: "paused" }}
              >
                <div className="flex">
                  {[...popularReviews, ...popularReviews].map(
                    (review, index) => (
                      <div
                        key={review._id + index}
                        className="w-[400px] flex-shrink-0 px-4"
                      >
                        <ReviewCard review={review} />
                      </div>
                    )
                  )}
                </div>
              </motion.div>
            </div>
          ) : (
            // ...existing empty state code...
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No reviews available yet
              </h3>
              <p className="text-purple-400 text-sm">
                Check back later for more reviews
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TopReviews;
