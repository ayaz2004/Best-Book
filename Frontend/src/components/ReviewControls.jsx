import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ReviewControls = ({ onPrevious, onNext }) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={onPrevious}
        className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-all">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={onNext}
        className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-all">
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ReviewControls;