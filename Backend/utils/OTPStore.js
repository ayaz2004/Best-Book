const OTP_STORE = {};

export const setOTP = (phoneNumber, otp) => {
  const expirationTime = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes (in milliseconds)
  OTP_STORE[phoneNumber] = { otp, expirationTime };
  console.log(OTP_STORE);
};

export const getOTP = (phoneNumber) => {
  const otpData = OTP_STORE[phoneNumber];
  if (!otpData) return null;

  if (Date.now() > otpData.expirationTime) {
    delete OTP_STORE[phoneNumber];
    return null;
  }

  return otpData.otp;
};

export const deleteOTP = (phoneNumber) => {
  delete OTP_STORE[phoneNumber];
};
