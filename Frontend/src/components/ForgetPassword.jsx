import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPhone, FaSpinner } from "react-icons/fa";
import { Alert } from "flowbite-react";

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      return setError("Please enter your phone number");
    }
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/auth/resendotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }

      setSuccess(true);
      // Navigate to OTP verification after 2 seconds
      setTimeout(() => {
        navigate(`/verify-otp?mode=reset-password&phoneNumber=${phoneNumber}`);
      }, 2000);
    } catch (error) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-800 rounded-full">
              <FaPhone className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-blue-900 tracking-tight">
            Forgot Password?
          </h2>
          <p className="text-purple-600">
            Enter your phone number and we'll send you an OTP to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="relative flex group">
              <span className="inline-flex items-center px-4 py-3 border-2 border-r-0 border-purple-200 rounded-l-xl bg-purple-50 text-purple-600">
                🇮🇳 +91
              </span>
              <input
                type="text"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.trim())}
                className="flex-1 pl-4 pr-4 py-3 border-2 border-purple-200 rounded-r-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 
                       text-white py-3 px-6 rounded-xl font-medium transition-all duration-200
                       hover:opacity-95 transform hover:-translate-y-1 shadow-lg hover:shadow-xl
                       disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <FaSpinner className="animate-spin" />
                <span>Sending OTP...</span>
              </div>
            ) : (
              "Send OTP"
            )}
          </motion.button>
        </form>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert color="failure" className="border-2 border-purple-200 bg-purple-50 text-purple-700 rounded-xl">
              {error}
            </Alert>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert color="success" className="border-2 border-green-200 bg-green-50 text-green-700 rounded-xl">
              OTP sent successfully! Redirecting...
            </Alert>
          </motion.div>
        )}

        <div className="text-center">
          <Link
            to="/sign-in"
            className="text-blue-900 hover:text-purple-700 text-sm font-medium transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}