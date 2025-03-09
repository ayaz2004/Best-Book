import React from 'react';
import { ArrowRight, BookOpen, GraduationCap, FlaskRound, Brain, Calculator, School } from 'lucide-react';
import { motion } from 'framer-motion';

const CategoryCard = ({ 
  title = "NEET",
  icon = "book",
  categories = ["class 11", "class 12", "Dropper"],
  backgroundColor = "bg-pink-50",
  iconColor = "text-pink-500"
}) => {
  const icons = {
    book: BookOpen,
    graduation: GraduationCap,
    flask: FlaskRound,
    brain: Brain,
    calculator: Calculator,
    school: School
  };

  const IconComponent = icons[icon] || BookOpen;

  return (
    <motion.div 
      className="max-w-sm p-6 bg-white rounded-2xl shadow-lg border-gray-400"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between">
        <div className="flex-1">
          <motion.h2 
            className="text-2xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.h2>

          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category, index) => (
              <motion.button 
                key={index}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "#F3F4F6" 
                }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>

          <motion.button 
            className="inline-flex items-center text-gray-700 group"
            whileHover={{ x: 5 }}
          >
            <span className="font-medium">Explore Category</span>
            <motion.div
              className="ml-2"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </div>

        <motion.div 
          className={`w-24 h-24 ${backgroundColor} rounded-full flex items-center justify-center`}
          animate={{ 
            y: [0, -10, 0] 
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{ scale: 1.1 }}
        >
          <IconComponent className={`w-12 h-12 ${iconColor}`} />
        </motion.div>
        {/* <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500"
        style={{ mixBlendMode: 'overlay' }}
        animate={{
          background: [
            'linear-gradient(45deg, #6366f1, #a855f7, #ec4899)',
            'linear-gradient(180deg, #ec4899, #6366f1, #a855f7)',
            'linear-gradient(45deg, #a855f7, #ec4899, #6366f1)',
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      /> */}
      </div>
    </motion.div>
  );
};

export default CategoryCard;