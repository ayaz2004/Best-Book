import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLock, FaSpinner } from "react-icons/fa";
import { Alert } from "flowbite-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const phoneNumber = searchParams.get("phoneNumber") || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters long");
    }

    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/user/resetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: formData.password,phoneNumber }),
      });

      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }

      navigate("/sign-in");
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
              <FaLock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-blue-900 tracking-tight">
            Create New Password
          </h2>
          <p className="text-purple-600">
            Please enter your new password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-blue-900 font-medium">New Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-4 pr-4 py-3 mt-1 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="text-blue-900 font-medium">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-4 pr-4 py-3 mt-1 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 
                     text-white py-3 px-6 rounded-xl font-medium transition-all duration-200
                     hover:opacity-95 transform hover:-translate-y-1 shadow-lg hover:shadow-xl
                     disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <FaSpinner className="animate-spin" />
                <span>Updating Password...</span>
              </div>
            ) : (
              "Update Password"
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
      </motion.div>
    </div>
  );
}