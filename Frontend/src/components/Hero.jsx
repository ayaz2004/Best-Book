import React from "react";
import svg from "../assets/online-learning-concept.svg";
import { motion } from "framer-motion";

// Animation variants
const floatingIconVariants = {
  animate: (custom) => ({
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      delay: custom * 0.2,
      ease: "easeInOut",
    },
  }),
};

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: custom * 0.1,
      ease: "easeOut"
    }
  })
};

const cardHoverVariants = {
  hover: {
    scale: 1.03,
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    transition: { duration: 0.3 }
  }
};

const buttonHoverVariants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

const Hero = () => {
  return (
    <div className="bg-gray-50 min-h-screen max-w-full m-10 overflow-hidden">
      {/* Container */}
      <div className="w-full mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center ">
          {/* Left Content */}
          <motion.div 
            className="w-full md:w-1/2 md:pr-8 mb-12 md:mb-0"
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            custom={0}
          >
            <motion.div 
              className="bg-[#FCEAEA] text-blue-900 px-4 py-2 rounded-full inline-block mb-6 text-sm"
              variants={fadeInUpVariants}
              custom={1}
            >
              Study Guides • Notes • Problem Solving
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 text-blue-900"
              variants={fadeInUpVariants}
              custom={2}
            >
              Find success in every study session
            </motion.h1>
            <motion.p 
              className="text-gray-600 mb-8 leading-relaxed"
              variants={fadeInUpVariants}
              custom={3}
            >
              Access comprehensive study materials designed to help you master
              complex topics, improve your grades, and build confidence in your
              academic journey.
            </motion.p>
            <motion.div 
              className="flex flex-wrap gap-4"
              variants={fadeInUpVariants}
              custom={4}
            >
              <motion.a
                href="#"
                className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white px-6 py-3 rounded-full font-medium flex items-center transition duration-300"
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Get Started
                <motion.svg
                  className="w-4 h-4 ml-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <path
                    d="M5 12H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 5L19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </motion.a>
              <motion.a
                href="#"
                className="border border-gray-300 text-gray-800 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition duration-300"
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Learn more
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            className="w-full md:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Background Blob */}
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-100 rounded-full opacity-90"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.9, 0.8, 0.9]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>

            {/* Main Image */}
            <motion.div 
              className="relative z-10"
              animate={{ rotate: [0, 1, 0, -1, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img
                src={svg}
                alt="Open book with study materials"
                className="max-w-full mx-auto"
              />
            </motion.div>

            {/* Floating Icons - using existing SVGs but with enhanced animations */}
            <motion.div
              className="absolute top-8 right-12 z-20"
              variants={floatingIconVariants}
              animate="animate"
              custom={0}
              whileHover={{ scale: 1.2, rotate: 180 }}
              transition={{ rotate: { duration: 0.5 } }}
            >
              <svg
                className="w-10 h-10 text-yellow-400"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 4.93L16.24 7.76M19.07 19.07L16.24 16.24M4.93 19.07L7.76 16.24M4.93 4.93L7.76 7.76"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
            <motion.div
              className="absolute bottom-12 right-16 z-20"
              variants={floatingIconVariants}
              animate="animate"
              custom={1}
              whileHover={{ scale: 1.2, y: -10 }}
            >
              <svg
                className="w-10 h-10 text-indigo-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 10L12 5L2 10L12 15L22 10ZM22 10V14M6 12.5V17C6 17.7956 6.31607 18.5587 6.87868 19.1213C7.44129 19.6839 8.20435 20 9 20H15C15.7956 20 16.5587 19.6839 17.1213 19.1213C17.6839 18.5587 18 17.7956 18 17V12.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
            <motion.div
              className="absolute top-1/4 left-4 z-20"
              variants={floatingIconVariants}
              animate="animate"
              custom={2}
              whileHover={{ scale: 1.2, rotate: -15 }}
            >
              <svg
                className="w-10 h-10 text-red-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20M4 19.5C4 20.163 4.26339 20.7989 4.73223 21.2678C5.20107 21.7366 5.83696 22 6.5 22H20V2H6.5C5.83696 2 5.20107 2.26339 4.73223 2.73223C4.26339 3.20107 4 3.83696 4 4.5V19.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
            <motion.div
              className="absolute bottom-8 left-12 z-20"
              variants={floatingIconVariants}
              animate="animate"
              custom={3}
              whileHover={{ scale: 1.2, x: 10 }}
            >
              <svg
                className="w-10 h-10 text-green-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 18V2M12 8H20M12 2H20M12 14H20M6 18V9L2 11V18M2 22H22M6 18H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.div>
        </section>

        {/* Featured Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
              }
            }
          }}
        >
          {/* Card 1 */}
          <motion.div 
            className="bg-red-50 rounded-xl overflow-hidden shadow-md flex h-36 relative"
            variants={fadeInUpVariants}
            whileHover={cardHoverVariants.hover}
          >
            {/* Left Icon Section - Overflowing */}
            <motion.div 
              className="absolute -left-12 top-1/2 -translate-y-1/2 w-32 h-32"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <svg
                className="w-full h-full text-red-300"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 21L12 17L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
                  fill="currentColor"
                  fillOpacity="0.2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 10L11 12L15 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>

            {/* Right Content Section */}
            <div className="flex-grow flex flex-col justify-center pl-16">
              <div className="p-5">
                <motion.div 
                  className="border-b border-red-100 mb-2"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <h3 className="font-semibold text-lg">Top Study Materials</h3>
                </motion.div>
                <div className="flex items-center">
                  <p className="text-sm text-gray-700 opacity-80">
                    Explore our most popular guides and notes this semester
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            className="bg-gray-900 text-white rounded-xl overflow-hidden shadow-md flex h-36"
            variants={fadeInUpVariants}
            whileHover={cardHoverVariants.hover}
          >
            <div className="p-5 flex-grow">
              <motion.h3 
                className="font-semibold text-lg mb-2"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                Premium Collection
              </motion.h3>
              <p className="text-sm opacity-80">
                Access comprehensive materials for challenging courses
              </p>
            </div>
            <motion.div 
              className="flex items-center justify-center w-1/3"
              animate={{ 
                rotateY: [0, 180, 0],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg
                className="w-24 h-24 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z"
                  fill="currentColor"
                  fillOpacity="0.2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 7H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M8 11H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M8 15H12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            className="bg-blue-50 rounded-xl overflow-hidden shadow-md flex h-36"
            variants={fadeInUpVariants}
            whileHover={cardHoverVariants.hover}
          >
            <div className="p-5 flex-grow">
              <h3 className="font-semibold text-lg mb-2">
                Exclusive Resources
              </h3>
              <motion.p 
                className="text-sm text-gray-700"
                animate={{ 
                  opacity: [0.6, 1, 0.6],
                  scale: [1, 1.03, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                ⭐⭐⭐⭐⭐ 500+ Reviews
              </motion.p>
            </div>
            <motion.div 
              className="flex items-center justify-center w-1/3"
              animate={{ 
                rotate: [0, 10, 0, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              <svg
                className="w-24 h-24 text-blue-300"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="currentColor"
                  fillOpacity="0.2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export { Hero };