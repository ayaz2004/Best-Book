import { Button, Label, TextInput } from "flowbite-react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
export default function SignIn() {

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
          className="flex-1 flex flex-col justify-center p-6"
          initial={{ opacity: 0, x: "-50%" }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign In</h1>
            <div>
              <Label value="Your Email" />
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <TextInput id="email" type="email" placeholder="Enter your email" className="pl-10" />
              </div>
            </div>
            <div>
              <Label value="Password" />
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <TextInput id="password" type="password" placeholder="Enter your password" className="pl-10" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm font-medium text-gray-600"
                >
                  Remember Me
                </label>
              </div>
              <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <Button gradientDuoTone="purpleToBlue" type="submit">
              Sign In
            </Button>
          </form>
          <div className="text-center mt-4">
            <span>Don't have an account?</span>{" "}
            <Link to="/sign-up" className="text-blue-500" onClick={() => setIsSignUpClicked(true)}>
              Sign Up
            </Link>
          </div>
        </motion.div>

        {/* Right Section */}
        <motion.div
          className="flex-1 flex flex-col justify-center items-center p-6 bg-gradient-to-r from-indigo-500 via-blue-600 to-blue-700 text-white rounded-lg"
          initial={{ opacity: 0, x: "50%" }}
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
      </motion.div>
    </motion.div>
  );
}
