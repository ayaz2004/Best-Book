import React, { useEffect, useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, User } from 'lucide-react';

const CustomerReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      comment: "This education platform has been instrumental in my exam preparation. The content is comprehensive and well-structured.",
      course: "UPSC Preparation",
      date: "2024-01-15",
      badge: "Top Performer"
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      comment: "The practice tests and study materials are excellent. I've seen significant improvement in my mock test scores.",
      course: "JEE Advanced",
      date: "2024-01-18",
      badge: "Course Champion"
    },
    {
      id: 3,
      name: "Priya Patel",
      rating: 4,
      comment: "Great platform for self-paced learning. The video lectures are particularly helpful and easy to follow.",
      course: "NEET Preparation",
      date: "2024-01-20",
      badge: "Quick Learner"
    },
    {
      id: 4,
      name: "Alex Thompson",
      rating: 5,
      comment: "The personalized study plans and progress tracking features have kept me motivated throughout my preparation.",
      course: "Gate CS",
      date: "2024-01-22",
      badge: "Consistent Achiever"
    },
    {
      id: 5,
      name: "Emily Rodriguez",
      rating: 5,
      comment: "The quality of mock tests and detailed solutions helped me understand concepts better. Highly recommended!",
      course: "CAT Preparation",
      date: "2024-01-25",
      badge: "Expert Student"
    },
    {
      id: 6,
      name: "Raj Malhotra",
      rating: 4,
      comment: "Outstanding study materials and expert guidance. The live doubt clearing sessions are extremely helpful.",
      course: "GATE ECE",
      date: "2024-01-28",
      badge: "Regular Learner"
    }
  ];

  const cardsToShow = 3;
  const totalGroups = Math.ceil(reviews.length / cardsToShow);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + cardsToShow;
          return nextIndex >= reviews.length ? 0 : nextIndex;
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovered, reviews.length]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - cardsToShow;
      return nextIndex < 0 ? reviews.length - cardsToShow : nextIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + cardsToShow;
      return nextIndex >= reviews.length ? 0 : nextIndex;
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-400'
        }`}
      />
    ));
  };

  const getCurrentGroup = () => Math.floor(currentIndex / cardsToShow);

  const ReviewCard = ({ review }) => (
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
                  {review.name}
                </h3>
                <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full mt-1">
                  {review.badge}
                </span>
              </div>
              <div className="flex">
                {renderStars(review.rating)}
              </div>
            </div>
            <div className="mt-4 relative">
              <Quote className="h-8 w-8 text-purple-400/20 absolute -left-2 -top-2" />
              <p className="text-gray-300 relative z-10 pl-6">{review.comment}</p>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-purple-400 font-medium">{review.course}</span>
              <span className="text-gray-400">
                {new Date(review.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className="w-full bg-gradient-to-br from-slate-800 via-slate-800 to-purple-900 rounded-2xl shadow-xl p-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Student Reviews</h2>
          <p className="text-purple-400 text-sm mt-1">What our students say about us</p>
        </div>
        <div className="flex space-x-3">
          {[...Array(totalGroups)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * cardsToShow)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                getCurrentGroup() === index 
                  ? 'bg-purple-500 w-6' 
                  : 'bg-gray-600 hover:bg-purple-400'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${(currentIndex * 100) / cardsToShow}%)`,
          }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="w-1/3 flex-shrink-0"
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={handlePrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-purple-500/20 hover:bg-purple-500/30 text-white p-2 rounded-full transition-all duration-300"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-500/20 hover:bg-purple-500/30 text-white p-2 rounded-full transition-all duration-300"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CustomerReviews;