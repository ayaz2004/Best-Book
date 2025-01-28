import React from "react";
import { Star, Quote, User, ThumbsUp, ThumbsDown } from "lucide-react";

const ReviewCard = ({ review, isPending = false, onApprove, onDisapprove }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
        }`}
      />
    ));
  };

  return (
    <div className="w-full px-2">
      <div className="bg-gradient-to-br from-slate-700/50 to-purple-900/30 backdrop-blur-sm rounded-xl p-6 h-full border border-purple-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="flex items-start space-x-4 relative">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {review.username}
                </h3>
                <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full mt-1">
                  {review.badge}
                </span>
              </div>
              <div className="flex">{renderStars(review.rating)}</div>
            </div>
            <div className="mt-4 relative">
              <Quote className="h-8 w-8 text-purple-400/20 absolute -left-2 -top-2" />
              <p className="text-gray-300 relative z-10 pl-6 line-clamp-3">
                {review.description}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-purple-400 font-medium">
                {review.course}
              </span>
              <span className="text-gray-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            {isPending && (
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => onApprove(review._id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all">
                  <ThumbsUp className="h-4 w-4" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => onDisapprove(review._id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all">
                  <ThumbsDown className="h-4 w-4" />
                  <span>Disapprove</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;