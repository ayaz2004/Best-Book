import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { FaGraduationCap, FaLock, FaPhone, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPhoneNumber } from "../redux/user/userSlice";

export default function SignUp() {
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumberState] = useState("");
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

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const updatedField = checked
        ? [...prevData[field], value]
        : prevData[field].filter((item) => item !== value);
      return { ...prevData, [field]: updatedField };
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value.trim() });
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
      return setErrorMessage("PLease fill out all the fields.");
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
      console.log(data.success);
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

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Best Book
            </span>
          </Link>
          <p className="text-sm mt-5">
            A website designed for best resources for education along with a
            section where you can practice questions and get your doubts
            cleared.
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your Username" />
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <TextInput
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  className="pl-10"
                  onChange={handleChange}
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
                  id="phoneNumber"
                  type="text"
                  placeholder="Enter your phone number"
                  className="rounded-l-md"
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                <select
                  id="currentClass"
                  className="pl-10 w-full"
                  onChange={handleChange}
                >
                  <option value="">Select Class</option>
                  <option value="class 6">class 6</option>
                  <option value="class 7">class 7</option>
                  <option value="class 8">class 8</option>
                  <option value="class 9">class 9</option>
                  <option value="class 10">class 10</option>
                  <option value="class 11">class 11</option>
                  <option value="class 12">class 12</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label value="Target Exam" />
                <div className="bg-gray-100 p-4 rounded-lg shadow">
                  {["XIth Entrance", "NEET", "JEE"].map((exam) => (
                    <label
                      key={exam}
                      className="flex items-center gap-2 text-gray-700 mb-2"
                    >
                      <input
                        type="checkbox"
                        value={exam}
                        onChange={(e) => handleCheckboxChange(e, "targetExam")}
                      />
                      {exam}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label value="Target Year" />
                <div className="bg-gray-100 p-4 rounded-lg shadow">
                  {["2025", "2026", "2027", "2028", "2029", "2030"].map(
                    (year) => (
                      <label
                        key={year}
                        className="flex items-center gap-2 text-gray-700 mb-2"
                      >
                        <input
                          type="checkbox"
                          value={year}
                          onChange={(e) =>
                            handleCheckboxChange(e, "targetYear")
                          }
                        />
                        {year}
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>
            <Button
              gradientDuoTone="purpleToBlue"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" /> <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5 " color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
