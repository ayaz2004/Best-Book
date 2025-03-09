import { motion } from 'framer-motion';

export const ShimmerButton = ({ children, onClick }) => {
  return (
    <motion.button
      className="inline-flex h-12 items-center justify-center rounded-md border border-[#372772] px-6 font-medium  focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50
      text-white"
      style={{
        background: "linear-gradient(110deg, #226CE0 45%, #2D7DD2 55%, #72A1E5)",
        backgroundSize: "200% 100%"
      }}
      animate={{
        backgroundPosition: ["0% 0%", "-200% 0%"],
      }}
      transition={{
        duration: 2,
        ease: "linear",
        repeat: Infinity,
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{
        scale: 0.95
      }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};