import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaSpinner, FaLock, FaMobile, FaRedo } from "react-icons/fa";
import { clearPhoneNumber } from "../redux/user/userSlice";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef([]);
  const { phoneNumber } = useSelector((state) => state.user);
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode"); // 'signup' or 'reset-password'
  const currentPhoneNumber = searchParams.get("phoneNumber");
  // useEffect(() => {
  //   if (!phoneNumber) {
  //     navigate("/sign-up");
  //   }
  // }, [phoneNumber, navigate]);

  useEffect(() => {
    let timer;
    if (resendDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(30);
    }
    return () => clearInterval(timer);
  }, [resendDisabled, countdown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    if (value.length > 1) return;

    const newOTP = [...otpValues];
    newOTP[index] = value;
    setOtpValues(newOTP);

    if (value !== "" && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    const newOTP = [...otpValues];

    for (let i = 0; i < pastedData.length; i++) {
      if (i < 4 && /^\d$/.test(pastedData[i])) {
        newOTP[i] = pastedData[i];
      }
    }
    setOtpValues(newOTP);
  };

  const handleResendOTP = async () => {
    if (resendDisabled) return;

    try {
      setLoading(true);
      const response = await fetch("/api/auth/resendotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        setResendDisabled(true);
        setOtpValues(["", "", "", ""]);
        inputRefs.current[0].focus();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError("");
    const Oldotp = otpValues.join("");

    if (Oldotp.length !== 4 || !/^\d+$/.test(Oldotp)) {
      setError("Please enter a valid 4-digit OTP");
      setLoading(false);
      return;
    }

    const otp = parseInt(Oldotp);

    try {
      const res = await fetch("/api/auth/verifyotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp,
          ...(mode === "reset-password" ? { phoneNumber: currentPhoneNumber }:{phoneNumber}),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(clearPhoneNumber());
        if (mode === "reset-password") {
          navigate(`/resetpassword?phoneNumber=${currentPhoneNumber}`); // New password reset page
        } else {
          navigate("/sign-in");
        }
      } else {
        setError(data.message || "Invalid OTP");
        setOtpValues(["", "", "", ""]);
        inputRefs.current[0].focus();
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isOTPComplete = otpValues.every((value) => value !== "");

  // if (!phoneNumber) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-800 rounded-full">
              <FaLock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-blue-900 tracking-tight">
            Verify Your Phone
          </h2>
          <div className="flex items-center justify-center space-x-2 text-sm text-purple-600">
            <FaMobile className="text-purple-500" />
            <span>
              Enter the OTP sent to{" "}
              <span className="font-semibold">
                ******{phoneNumber?.slice(-4)}
              </span>
            </span>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex justify-center space-x-4">
            {otpValues.map((value, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                className="w-14 h-14 text-center text-2xl font-bold border-2 border-purple-200 rounded-xl 
                          focus:border-blue-600 focus:ring-2 focus:ring-purple-200 transition-all duration-200
                          bg-white outline-none"
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                inputMode="numeric"
                pattern="\d*"
                autoFocus={index === 0}
              />
            ))}
          </div>

          {error && (
            <div className="bg-purple-50 border-2 border-purple-200 p-4 rounded-xl">
              <p className="text-purple-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            onClick={handleVerifyOTP}
            disabled={!isOTPComplete || loading}
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent 
                      text-sm font-medium rounded-xl text-white transition-all duration-200 
                      ${
                        isOTPComplete && !loading
                          ? "bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 hover:opacity-95 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
          >
            {loading ? (
              <FaSpinner className="animate-spin w-5 h-5" />
            ) : (
              <>
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <FaLock className="h-5 w-5 text-white/70" />
                </span>
                Verify OTP
              </>
            )}
          </button>

          <div className="text-center">
            <button
              className={`inline-flex items-center space-x-2 text-sm ${
                resendDisabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-900 hover:text-purple-700"
              }`}
              onClick={handleResendOTP}
              disabled={resendDisabled}
            >
              <FaRedo className={resendDisabled ? "animate-spin" : ""} />
              <span>
                {resendDisabled ? `Resend OTP in ${countdown}s` : "Resend OTP"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
