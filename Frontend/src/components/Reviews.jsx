







import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import ReviewSection from "./ReviewSection";
import ReviewControls from "./ReviewControls"

const notify = (text) => toast(text,{
  closeOnClick:true,
  type:"success",
  style: {
    background: 'linear-gradient(to right, rgb(30, 41, 59), rgb(88, 28, 135))',
    color: '#fff',
    borderRadius: '0.75rem',
    border: '1px solid rgba(139, 92, 246, 0.2)',
  },
  progressStyle: {
    background: 'rgba(139, 92, 246, 0.7)'
  },
});
const CustomerReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [unApprovedReviews, setUnApprovedReviews] = useState([]);
  const [reviews, setReviews] = useState([]);

  const cardsToShow = 3;

  useEffect(() => {
    fetchUnApproveReviews();
    fetchApprovedReviews();
  }, []);

  const fetchApprovedReviews = async () => {
    try {
      const response = await fetch("/api/reviews/approvereview");
      const data = await response.json();
      setReviews(data.reviews);
    } catch (error) {
      console.error("Error fetching approved reviews:", error);
    }
  };

  const fetchUnApproveReviews = async () => {
    try {
      const response = await fetch("/api/reviews/unapprovereview");
      const data = await response.json();
      setUnApprovedReviews(data.reviews);
    } catch (error) {
      console.error("Error fetching unapproved reviews:", error);
    }
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex * cardsToShow < reviews.length) {
      setCurrentIndex(nextIndex);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentIndex(prevIndex);
    } else {
      setCurrentIndex(Math.floor((reviews.length - 1) / cardsToShow));
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      const response = await fetch(`/api/reviews/approvereview/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      fetchUnApproveReviews();
      fetchApprovedReviews();
      notify("Review Approved Successfully");
    } catch (error) {
      console.error("Error approving review:", error);
    }
  };

  const handleDisapprove = async (reviewId) => {
    try {
      const response = await fetch(`/api/reviews/deletereviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      fetchUnApproveReviews();
      notify("Review Disapproved Successfully");
    } catch (error) {
      console.error("Error disapproving review:", error);
    }
  };

  return (
    <div className="space-y-8">
      <ToastContainer position="top-center" autoClose={2000} />
      {/* Approved Reviews Section */}
      {reviews.length > 0 && (
        <ReviewSection
          title="Customer Reviews"
          subtitle="What our customers say about us"
          reviews={reviews.slice(currentIndex * cardsToShow, (currentIndex + 1) * cardsToShow)}
          controls={<ReviewControls onPrevious={handlePrevious} onNext={handleNext} />}
        />
      )}

      {/* Pending Reviews Section */}
      <ReviewSection
        title="Pending Reviews"
        subtitle="Reviews awaiting approval"
        reviews={unApprovedReviews}
        isPending={true}
        onApprove={handleApprove}
        onDisapprove={handleDisapprove}
      />
    </div>
  );
};

export default CustomerReviews;






// import React, { useEffect, useState } from "react";
// import {
//   Star,
//   Quote,
//   User,
//   ThumbsUp,
//   ThumbsDown,
//   ChevronLeft,
//   ChevronRight,
//   CheckCircle
// } from "lucide-react";
// import { ToastContainer, toast } from 'react-toastify';


// const notify = (text) => toast(text,{
//   closeOnClick:true,
//   type:"success",
//   style: {
//     background: 'linear-gradient(to right, rgb(30, 41, 59), rgb(88, 28, 135))',
//     color: '#fff',
//     borderRadius: '0.75rem',
//     border: '1px solid rgba(139, 92, 246, 0.2)',
//   },
//   progressStyle: {
//     background: 'rgba(139, 92, 246, 0.7)'
//   },
// });
// const CustomerReviews = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isHovered, setIsHovered] = useState(false);
//   const [unApprovedReviews, setUnApprovedReviews] = useState([]);
//   const [reviews, setReviews] = useState([]);

//   const cardsToShow = 3;
//   const totalGroups = Math.ceil(reviews.length / cardsToShow);

//   useEffect(() => {
//     fetchUnApproveReviews();
//     fetchApprovedReviews();
//   }, []);

//   const fetchApprovedReviews = async () => {
//     try {
//       const response = await fetch("/api/reviews/approvereview");
//       const data = await response.json();
//       console.info("Approved reviews:", data.reviews);
//       setReviews(data.reviews);
//     } catch (error) {
//       console.error("Error fetching approved reviews:", error);
//     }
//   };

//   const fetchUnApproveReviews = async () => {
//     try {
//       const response = await fetch("/api/reviews/unapprovereview");
//       const data = await response.json();
//       console.info("Unapproved reviews:", data.reviews);
//       setUnApprovedReviews(data.reviews);
//     } catch (error) {
//       console.error("Error fetching unapproved reviews:", error);
//     }
//   };

//   const handleNext = () => {
//     const nextIndex = currentIndex + 1;
//     if (nextIndex * cardsToShow < reviews.length) {
//       setCurrentIndex(nextIndex);
//     } else {
//       setCurrentIndex(0); // Reset to beginning
//     }
//   };

//   const handlePrevious = () => {
//     const prevIndex = currentIndex - 1;
//     if (prevIndex >= 0) {
//       setCurrentIndex(prevIndex);
//     } else {
//       setCurrentIndex(Math.floor((reviews.length - 1) / cardsToShow)); // Go to last group
//     }
//   };

//   useEffect(() => {
//     if (!isHovered && reviews.length > cardsToShow) {
//       const timer = setInterval(handleNext, 5000);
//       return () => clearInterval(timer);
//     }
//   }, [isHovered, currentIndex, reviews.length]);

//   const renderStars = (rating) => {
//     return [...Array(5)].map((_, index) => (
//       <Star
//         key={index}
//         className={`h-4 w-4 ${
//           index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
//         }`}
//       />
//     ));
//   };

//   const handleApprove = async (reviewId) => {
//     try {
//       const response = await fetch(`/api/reviews/approvereview/${reviewId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       const data = await response.json();
//       console.info("Review approved:", data);
//       // Refresh both review lists
//       fetchUnApproveReviews();
//       fetchApprovedReviews();
//       notify("Review Approved Successfully")
//     } catch (error) {
//       console.error("Error approving review:", error);
//     }
//   };

//   const handleDisapprove = async (reviewId) => {
//     try {
//       const response = await fetch(`/api/reviews/deletereviews/${reviewId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(
//           `Failed to disapprove review with status: ${response.status}`
//         );
//       }

//       const data = await response.json();
//       console.info("Review disapproved:", data);
//       // Refresh the unapproved reviews list
//       fetchUnApproveReviews();
//       notify("Review Disapproved Successfully")
//     } catch (error) {
//       console.error("Error disapproving review:", error);
//     }
//   };

//   const ReviewCard = ({ review, isPending = false }) => (
//     <div className="w-full px-2">
//       <div className="bg-gradient-to-br from-slate-700/50 to-purple-900/30 backdrop-blur-sm rounded-xl p-6 h-full border border-purple-500/20 relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
//         <div className="flex items-start space-x-4 relative">
//           <div className="flex-shrink-0">
//             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
//               <User className="h-6 w-6 text-white" />
//             </div>
//           </div>
//           <div className="flex-1">
//             <div className="flex items-start justify-between">
//               <div>
//                 <h3 className="text-lg font-semibold text-white">
//                   {review.username}
//                 </h3>
//                 <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full mt-1">
//                   {review.badge}
//                 </span>
//               </div>
//               <div className="flex">{renderStars(review.rating)}</div>
//             </div>
//             <div className="mt-4 relative">
//               <Quote className="h-8 w-8 text-purple-400/20 absolute -left-2 -top-2" />
//               <p className="text-gray-300 relative z-10 pl-6 line-clamp-3">
//                 {review.description}
//               </p>
//             </div>
//             <div className="mt-4 flex items-center justify-between text-sm">
//               <span className="text-purple-400 font-medium">
//                 {review.course}
//               </span>
//               <span className="text-gray-400">
//                 {new Date(review.createdAt).toLocaleDateString()}
//               </span>
//             </div>
//             {isPending && (
//               <div className="mt-4 flex justify-end space-x-3">
//                 <button
//                   onClick={() => handleApprove(review._id)}
//                   className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all">
//                   <ThumbsUp className="h-4 w-4" />
//                   <span>Approve</span>
//                 </button>
//                 <button
//                   onClick={() => handleDisapprove(review._id)}
//                   className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all">
//                   <ThumbsDown className="h-4 w-4" />
//                   <span>Disapprove</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="space-y-8">
//       <ToastContainer position="top-center" autoClose={2000} />
//       {/* Approved Reviews Section */}
//       {reviews.length > 0 && (
//         <div className="w-full bg-gradient-to-br from-slate-800 via-slate-800 to-purple-900 rounded-2xl shadow-xl p-6">
//           <div className="mb-8 flex justify-between items-center">
//             <div>
//               <h2 className="text-2xl font-bold text-white">
//                 Customer Reviews
//               </h2>
//               <p className="text-purple-400 text-sm mt-1">
//                 What our customers say about us
//               </p>
//             </div>
//             {reviews.length > cardsToShow && (
//               <div className="flex space-x-2">
//                 <button
//                   onClick={handlePrevious}
//                   className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-all">
//                   <ChevronLeft className="h-6 w-6" />
//                 </button>
//                 <button
//                   onClick={handleNext}
//                   className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-all">
//                   <ChevronRight className="h-6 w-6" />
//                 </button>
//               </div>
//             )}
//           </div>

//           <div
//             className="relative overflow-hidden"
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}>
//             <div className="grid grid-cols-3 gap-4">
//               {reviews
//                 .slice(
//                   currentIndex * cardsToShow,
//                   (currentIndex + 1) * cardsToShow
//                 )
//                 .map((review) => (
//                   <ReviewCard key={review._id} review={review} />
//                 ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Pending Reviews Section */}
//       {unApprovedReviews.length > 0 ? (
//   <div className="w-full bg-gradient-to-br from-slate-800 via-slate-800 to-purple-900 rounded-2xl shadow-xl p-6">
//     <div className="mb-8">
//       <h2 className="text-2xl font-bold text-white">Pending Reviews</h2>
//       <p className="text-purple-400 text-sm mt-1">
//         Reviews awaiting approval
//       </p>
//     </div>

//     <div className="max-h-96 overflow-y-auto pr-4 custom-scrollbar">
//       <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//         {unApprovedReviews.map((review) => (
//           <ReviewCard key={review._id} review={review} isPending={true} />
//         ))}
//       </div>
//     </div>
//   </div>
// ) : (
//   <div className="w-full bg-gradient-to-br from-slate-800 via-slate-800 to-purple-900 rounded-2xl shadow-xl p-6">
//     <div className="flex flex-col items-center justify-center py-12 text-center">
//       <div className="w-16 h-16 mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
//         <CheckCircle className="h-8 w-8 text-purple-400" />
//       </div>
//       <h3 className="text-xl font-semibold text-white mb-2">
//         No Pending Reviews
//       </h3>
//       <p className="text-purple-400 text-sm">
//         All reviews have been processed
//       </p>
//     </div>
//   </div>
// )}

//       <style jsx global>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 8px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: rgba(139, 92, 246, 0.1);
//           border-radius: 4px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: rgba(139, 92, 246, 0.3);
//           border-radius: 4px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: rgba(139, 92, 246, 0.4);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default CustomerReviews;
