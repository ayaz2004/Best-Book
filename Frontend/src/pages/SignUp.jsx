import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaGraduationCap, FaLock, FaPhone, FaUser, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPhoneNumber } from "../redux/user/userSlice";

export default function SignUp() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: "",
    password: "",
    currentClass: "",
    targetExam: [],
    targetYear: [],
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const availableExams = ["XIth Entrance", "NEET", "JEE", "KVPY", "NTSE"];
  const availableYears = ["2025", "2026", "2027", "2028", "2029", "2030"];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value.trim() });
  };

  const handleSelectOption = (option, field) => {
    if (!formData[field].includes(option)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], option]
      }));
    }
  };

  const handleRemoveOption = (option, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== option)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.username ||
      !formData.phoneNumber ||
      !formData.password ||
      !formData.currentClass ||
      !formData.targetExam.length ||
      !formData.targetYear.length
    ) {
      return setErrorMessage("Please fill out all the fields.");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        dispatch(setPhoneNumber(formData.phoneNumber));
        navigate("/verify-otp");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };



  const MultiSelect = ({ field, options, selected, label }) => (
    <div className="space-y-1">
      <Label value={label} className="block text-sm" />
      <div className="relative">
        <select
          className="w-full rounded-lg border border-gray-300 p-2 text-sm"
          onChange={(e) => handleSelectOption(e.target.value, field)}
          value=""
        >
          <option value="" disabled>Select {label}</option>
          {options.filter(option => !selected.includes(option)).map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-1">
        {selected.map(option => (
          <motion.span
            key={option}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800"
          >
            {option}
            <button
              type="button"
              onClick={() => handleRemoveOption(option, field)}
              className="ml-1 focus:outline-none"
            >
              <FaTimes className="w-2.5 h-2.5" />
            </button>
          </motion.span>
        ))}
      </div>
    </div>
  );

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
                Join our community of learners and get access to the best educational resources.
              </p>
              <motion.div 
                className="mt-8 bg-white/10 p-6 rounded-xl backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="font-semibold text-xl mb-4">Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">✓</span>
                    <span>Personalized Learning Path</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">✓</span>
                    <span>Expert Study Materials</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">✓</span>
                    <span>Interactive Practice Tests</span>
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </motion.div>
  
          {/* Right Side - Form */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex-1 p-8 bg-white"
          >
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-bold mb-2 text-blue-900">Create Account</h2>
              <p className="text-purple-600 mb-8">Join our community today</p>
              
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                {/* Username Input */}
                <div className="space-y-2">
                  <Label value="Username" className="text-blue-900 font-medium" />
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
                </div>
  
                {/* Phone Number Input */}
                <div className="space-y-2">
                  <Label value="Phone Number" className="text-blue-900 font-medium" />
                  <div className="relative flex group">
                    <span className="inline-flex items-center px-4 py-3 border-2 border-r-0 border-purple-200 rounded-l-xl bg-purple-50 text-purple-600">
                      🇮🇳 +91
                    </span>
                    <input
                      type="text"
                      id="phoneNumber"
                      placeholder="Enter your phone number"
                      onChange={handleChange}
                      className="flex-1 pl-4 pr-4 py-3 border-2 border-purple-200 rounded-r-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    />
                  </div>
                </div>
  
                {/* Password Input */}
                <div className="space-y-2">
                  <Label value="Password" className="text-blue-900 font-medium" />
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
                </div>
  
                {/* Current Class Select */}
                <div className="space-y-2">
                  <Label value="Current Class" className="text-blue-900 font-medium" />
                  <div className="relative group">
                    <FaGraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 group-hover:text-purple-600 transition-colors" />
                    <select
                      id="currentClass"
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all appearance-none bg-white"
                    >
                      <option value="">Select Class</option>
                      {['6', '7', '8', '9', '10', '11', '12'].map((num) => (
                        <option key={num} value={`class ${num}`}>Class {num}</option>
                      ))}
                    </select>
                  </div>
                </div>
  
                {/* MultiSelect components */}
                <div className="space-y-4">
                  <MultiSelect
                    field="targetExam"
                    options={availableExams}
                    selected={formData.targetExam}
                    label="Target Exams"
                  />
                  <MultiSelect
                    field="targetYear"
                    options={availableYears}
                    selected={formData.targetYear}
                    label="Target Years"
                  />
                </div>
  
                {/* Submit Button */}
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
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    "Sign Up"
                  )}
                </button>
  
                {/* Sign In Link */}
                <div className="flex gap-2 text-sm justify-center">
                  <span className="text-blue-900">Already have an account?</span>
                  <Link 
                    to="/sign-in" 
                    className="text-purple-600 font-medium hover:text-purple-700 hover:underline transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              </form>
  
              {/* Error Message */}
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