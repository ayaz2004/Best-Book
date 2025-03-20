import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";

const ToastNotification = ({
  showToast,
  setShowToast,
  toastMessage,
  appliedCoupon,
}) => {
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast, setShowToast]);

  const isSuccess = appliedCoupon || toastMessage.includes("success");

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            isSuccess ? "bg-green-50" : "bg-red-50"
          } flex items-center max-w-sm`}
        >
          <div className="flex-shrink-0">
            {isSuccess ? (
              <FaCheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <FaTimesCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
          <div className="ml-3">
            <p
              className={`text-sm font-medium ${
                isSuccess ? "text-green-800" : "text-red-800"
              }`}
            >
              {toastMessage}
            </p>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="ml-auto bg-transparent flex-shrink-0"
          >
            <FaTimes
              className={`h-4 w-4 ${
                isSuccess ? "text-green-500" : "text-red-500"
              }`}
            />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastNotification;
