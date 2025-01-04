import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const sendOTP = async (phoneNumber) => {
  const otp = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit OTP
  console.log(`Generated OTP: for ${phoneNumber} :-> ${otp}`);

  try {
    const message = await client.messages.create({
      body: `Your OTP is: ${otp}`, // Send OTP in the message
      from: "+12315005883", // Twilio phone number (update with your own)
      to: `+91${phoneNumber}`, // Dynamically use the phone number passed in
    });

    console.log(`Message sent successfully with SID: ${message.sid}`);
    return { otp }; // Return the OTP to be used in the signup process
  } catch (error) {
    console.log("Error sending OTP:", error);
    return { status: 500, message: "Internal Server Error" };
  }
};
