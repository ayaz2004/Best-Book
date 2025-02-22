import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaLock, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js";

export default function SignIn() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      return dispatch(signInFailure("Please fill out all the fields."));
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(signInFailure(data.message || "Sign in failed"));
        return;
      }

      if (data.success && data.user) {
        dispatch(signInSuccess(data.user));
        navigate("/");
      } else {
        dispatch(signInFailure(data.message));
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-purple-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Brand */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex-1 p-8 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-800 text-white flex flex-col justify-center"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Link to="/" className="font-bold text-4xl mb-6 block">
                <span className="px-2 py-1 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
                  Best Book
                </span>
              </Link>
              <p className="text-lg mt-6 text-white/90 leading-relaxed">
                A website designed for best resources for education along with a
                section where you can practice questions and get your doubts
                cleared.
              </p>
              <motion.div
                className="mt-8 bg-white/10 p-6 rounded-xl backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="font-semibold text-xl mb-4">
                  Why Choose Best Book?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                      ✓
                    </span>
                    <span>Comprehensive Study Materials</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                      ✓
                    </span>
                    <span>Interactive Practice Sessions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                      ✓
                    </span>
                    <span>Expert Doubt Resolution</span>
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Side - Sign In Form */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex-1 p-8 bg-white"
          >
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-bold mb-2 text-blue-900">
                Welcome Back!
              </h2>
              <p className="text-purple-600 mb-8">
                Please sign in to your account
              </p>

              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="space-y-2"
                >
                  <Label
                    value="Username"
                    className="text-blue-900 font-medium"
                  />
                  <div className="relative group">
                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 group-hover:text-purple-600 transition-colors" />
                    <input
                      type="text"
                      id="username"
                      placeholder="Enter your username"
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="space-y-2"
                >
                  <Label
                    value="Password"
                    className="text-blue-900 font-medium"
                  />
                  <div className="relative group">
                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 group-hover:text-purple-600 transition-colors" />
                    <input
                      type="password"
                      id="password"
                      placeholder="Enter your password"
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                >
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white py-3 px-6 rounded-xl font-medium
                             hover:opacity-95 transform hover:-translate-y-1 transition-all duration-200 
                             focus:ring-4 focus:ring-purple-200 disabled:opacity-70 disabled:cursor-not-allowed
                             shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <Spinner size="sm" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  className="flex gap-2 text-sm justify-center"
                >
                  <span className="text-blue-900">Don't have an account?</span>
                  <Link
                    to="/sign-up"
                    className="text-purple-600 font-medium hover:text-purple-700 hover:underline transition-colors"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </form>

              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6"
                >
                  <Alert
                    color="failure"
                    className="border-2 border-purple-200 bg-purple-50 text-purple-700 rounded-xl"
                  >
                    {errorMessage}
                  </Alert>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
