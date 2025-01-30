import React from "react";
import { Star, Quote, User, ThumbsUp, ThumbsDown, Edit, Trash } from "lucide-react";
import { DialogBox } from "./DialogBox";

const ReviewCard = ({ review, username = null, isPending = false, onApprove, onDisapprove, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const isOwner = username === review.username;
  console.log(username)
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-500 fill-yellow-500" : isDark ? "text-gray-600" : "text-gray-300"
        }`}
      />
    ));
  };

  const onDelete = async (reviewId) => {
    try {
      const response = await fetch(`/api/reviews/deletereviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if(response.ok){
        alert("Review Deleted Successfully");
        window.location.reload();
        
      }
    } catch (error) {
      alert("Error deleting review:", error.message);
      
    }
  }
  const onUpdate = async (reviewId) => {}

  return (
    <div className="w-full px-2">
      <div className={`${
        isDark 
          ? "bg-gradient-to-br from-slate-700/50 to-purple-900/30 backdrop-blur-sm border-purple-500/20"
          : "bg-white border-gray-200"
      } rounded-lg p-6 h-full border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden` }>
        {isDark && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
        )}
        <div className="flex items-start space-x-4 relative">
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 rounded-full ${
              isDark 
                ? "bg-gradient-to-br from-purple-400 to-purple-600"
                : "bg-blue-100"
            } flex items-center justify-center`}>
              <User className={`h-6 w-6 ${isDark ? "text-white" : "text-blue-600"}`} />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {review.username}
                </h3>
                <span className={`inline-block px-3 py-1 ${
                  isDark 
                    ? "bg-purple-500/20 text-purple-300"
                    : "bg-blue-50 text-blue-600"
                } text-xs rounded-full mt-1`}>
                  {review.badge}
                </span>
              </div>
              <div className="flex">{renderStars(review.rating)}</div>
            </div>
            <div className="mt-4 relative">
              <Quote className={`h-8 w-8 ${
                isDark ? "text-purple-400/20" : "text-gray-200"
              } absolute -left-2 -top-2`} />
              <p className={`relative z-10 pl-6 line-clamp-3 ${
                isDark ? "text-gray-300" : "text-gray-600 font-bold"
              }`}>
                {review.description}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className={`font-medium ${
                isDark ? "text-purple-400" : "text-blue-600"
              }`}>
                {review.course}
              </span>
              <span className={isDark ? "text-gray-400" : "text-gray-500"}>
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            {isPending && (
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => onApprove(review._id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    isDark
                      ? "bg-green-500/20 hover:bg-green-500/30 text-green-400"
                      : "bg-green-50 hover:bg-green-100 text-green-600"
                  }`}>
                  <ThumbsUp className="h-4 w-4" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => onDisapprove(review._id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    isDark
                      ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                      : "bg-red-50 hover:bg-red-100 text-red-600"
                  }`}>
                  <ThumbsDown className="h-4 w-4" />
                  <span>Disapprove</span>
                </button>
              </div>
            )}
            {isOwner && (
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => onUpdate(review._id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    isDark
                      ? "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
                      : "bg-blue-50 hover:bg-blue-100 text-blue-600"
                  }`}>
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onDelete(review._id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    isDark
                      ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                      : "bg-red-50 hover:bg-red-100 text-red-600"
                  }`}>
                  <Trash className="h-4 w-4" />
                  <span>Delete</span>
                 
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
