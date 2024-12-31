import { Button, Label, Select, TextInput } from "flowbite-react";
import { FaEnvelope, FaGraduationCap, FaLock, FaPhone, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function SignUp() {
  return (
    <motion.div className="min-h-screen flex items-center justify-center bg-blue-400 overflow-hidden">
      <motion.div
        className="flex flex-col md:flex-row items-stretch max-w-4xl w-full gap-6 bg-white shadow-lg rounded-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left Section */}
        <motion.div
          className="flex-1 flex flex-col justify-center items-center p-6 bg-gradient-to-r from-indigo-500 via-blue-600 to-blue-700 text-white rounded-lg"
          initial={{ opacity: 0, x: "-50%" }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="\" className="font-bold text-4xl">
            Best Book
          </Link>
          <p className="mt-4 text-center text-lg">
            A website designed for the best resources for education along with a section where you can practice
            questions and get your doubts cleared.
          </p>
        </motion.div>

        {/* Right Section */}
        <motion.div
          className="flex-1 flex flex-col justify-center p-6"
          initial={{ opacity: 0, x: "50%" }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Your Username" />
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <TextInput id="username" placeholder="Enter your username" className="pl-10" />
              </div>
            </div>
            <div>
              <Label value="Your Email" />
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <TextInput id="email" type="email" placeholder="Enter your email" className="pl-10" />
              </div>
            </div>
            <div>
              <Label value="Phone(+91)" />
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <TextInput id="phone" type="text" placeholder="Enter your phone number" className="pl-10" />
              </div>
            </div>
            <div>
              <Label value="Password" />
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <TextInput id="password" type="password" placeholder="Enter your password" className="pl-10" />
              </div>
            </div>
            <div>
              <Label htmlFor="currentClass" value="Current Class" />
              <Select id="currentClass">
                <option value="">Select Class</option>
                <option value="class 6">Class 6</option>
                <option value="class 7">Class 7</option>
                <option value="class 8">Class 8</option>
                <option value="class 9">Class 9</option>
                <option value="class 10">Class 10</option>
                <option value="class 11">Class 11</option>
                <option value="class 12">Class 12</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="targetExam" value="Target Exam" />
                <Select id="targetExam">
                  <option value="">Select Exam</option>
                  <option value="XIth Entrance">XIth Entrance</option>
                  <option value="NEET">NEET</option>
                  <option value="JEE">JEE</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="targetYear" value="Target Year" />
                <Select id="targetYear">
                  <option value="">Select Year</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                </Select>
              </div>
            </div>
            <Button gradientDuoTone="purpleToBlue" type="submit">
              Sign Up
            </Button>
          </form>
          <div className="text-center mt-4">
            <span>Already have an account?</span>{" "}
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
