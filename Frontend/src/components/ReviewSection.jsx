import React from "react";
import ReviewCard from "./ReviewCard";
import { CheckCircle } from "lucide-react";
const ReviewSection = ({ title, subtitle, reviews, isPending = false, onApprove, onDisapprove }) => {
  return (
    <div className="w-full bg-gradient-to-br from-slate-800 via-slate-800 to-purple-900 rounded-2xl shadow-xl p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-purple-400 text-sm mt-1">{subtitle}</p>
      </div>

      {reviews.length > 0 ? (
        <div className="max-h-96 overflow-y-auto pr-4 custom-scrollbar">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                isPending={isPending}
                onApprove={onApprove}
                onDisapprove={onDisapprove}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No {isPending ? "Pending" : "Approved"} Reviews
          </h3>
          <p className="text-purple-400 text-sm">
            {isPending ? "All reviews have been processed" : "No reviews available"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;