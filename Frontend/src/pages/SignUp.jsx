import { Button, Label, Select, TextInput } from "flowbite-react";
import {
  FaEnvelope,
  FaGraduationCap,
  FaLock,
  FaPhone,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="\" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Best Book
            </span>
          </Link>
          <p className="text-sm mt-5">
            A website designed for best resoureces for education along with
            section where you can practice questions and get your doubts
            cleared.
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className=" flex flex-col gap-4">
            <div>
              <Label value="Your Username" />
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <TextInput
                  id="username"
                  placeholder="Enter your username"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label value="Your Email" />
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <TextInput
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label value="Phone(+91)" />
              <div className="relative flex items-center gap-4">
                <FaPhone className="left-3 top-1/2 transform text-gray-400 ml-3.5" />
                <span className="flex items-center justify-center px-4 py-2 border rounded-l-md bg-gray-200 text-gray-700">
                  🇮🇳 +91
                </span>
                <TextInput
                  id="phone"
                  type="text"
                  placeholder="Enter your phone number"
                  className="rounded-l-md"
                />
              </div>
            </div>

            <div>
              <Label value="Password" />
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <TextInput
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="currentClass"
                value="Current Class"
                className="text-gray-700"
              />
              <div className="relative">
                <FaGraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Select id="currentClass" className="pl-10">
                  <option value="">Select Class</option>
                  <option value="class 6">class 6</option>
                  <option value="class 7">class 7</option>
                  <option value="class 8">class 8</option>
                  <option value="class 9">class 9</option>
                  <option value="class 10">class 10</option>
                  <option value="class 11">class 11</option>
                  <option value="class 12">class 12</option>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="targetExam"
                  value="Target Exam"
                  className="text-gray-700"
                />
                <Select id="targetExam">
                  <option value="">Select Exam</option>
                  <option value="XIth Entrance">XIth Entrance</option>
                  <option value="NEET">NEET</option>
                  <option value="JEE">JEE</option>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="targetYear"
                  value="Target Year"
                  className="text-gray-700"
                />
                <Select id="targetYear">
                  <option value="">Select Year</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                  <option value="2030">2030</option>
                </Select>
              </div>
            </div>
            <Button gradientDuoTone="purpleToBlue" type="submit">
              Sign Up
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              {" "}
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
