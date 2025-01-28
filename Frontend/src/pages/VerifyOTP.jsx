import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, KeyRound } from 'lucide-react';

const OTPVerification = async() => {
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [currentStep, setCurrentStep] = useState(1);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOTP = [...otpValues];
    newOTP[index] = value;
    setOtpValues(newOTP);

    // Move to next input if value is entered
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    const newOTP = [...otpValues];
    
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 4) {
        newOTP[i] = pastedData[i];
      }
    }
    
    setOtpValues(newOTP);
  };

  const isOTPComplete = otpValues.every(value => value !== '');

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <KeyRound className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center">Enter Verification Code</h2>
            <p className="text-gray-600 text-center">
              We've sent a 4-digit code to your email
              <br />
              <span className="font-medium">example@email.com</span>
            </p>
            <div className="flex justify-center space-x-4 my-8">
              {otpValues.map((value, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-14 h-14 text-center text-xl font-semibold rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white text-gray-800 transition-all"
                />
              ))}
            </div>
            <button
              onClick={() => isOTPComplete && setCurrentStep(2)}
              className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                isOTPComplete
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:from-purple-600 hover:to-purple-700'
                  : 'bg-purple-100 text-purple-300 cursor-not-allowed'
              }`}
            >
              <span>Verify Code</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <p className="text-center text-gray-600">
              Didn't receive the code? 
              <button className="text-purple-600 font-medium ml-2 hover:text-purple-700">
                Resend
              </button>
            </p>
          </div>
        );
      case 2:
        return (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Verification Successful!</h2>
            <p className="text-gray-600">You can now proceed to your account</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          {/* Progress bar */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2].map((step) => (
              <div
                key={step}
                className="flex items-center"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step <= currentStep
                      ? 'bg-purple-500 text-white'
                      : 'bg-purple-100 text-purple-300'
                  }`}
                >
                  {step}
                </div>
                {step < 2 && (
                  <div className={`w-24 h-1 mx-2 rounded ${
                    step < currentStep ? 'bg-purple-500' : 'bg-purple-100'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {getStepContent()}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                currentStep > 1
                  ? 'text-purple-600 hover:bg-purple-50'
                  : 'text-purple-300 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            <button
              onClick={() => currentStep < 2 && isOTPComplete && setCurrentStep(currentStep + 1)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                currentStep < 2 && isOTPComplete
                  ? 'text-purple-600 hover:bg-purple-50'
                  : 'text-purple-300 cursor-not-allowed'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;