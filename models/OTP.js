import mongoose from "mongoose";
import mailSender from "../utils/mailSender";
import otpTemplate from "../mail/templates/emailVerification";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    // The document will be automatically deleted after 5 minutes of its creation time
    expires: 5 * 60,
  },
});

// a function to send an email
const sendVerificationEmail = async (email, otp) => {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from StudyNotion",
      otpTemplate(otp)
    );
    return mailResponse;
  } catch (error) {
    throw new Error("Error occurred while sending mail: " + error.message);
  }
};

otpSchema.pre("save", async function (next) {
  // only send an email when a new document is being created
  if (this.isNew) {
    try {
      const mailResponse = await sendVerificationEmail(this.email, this.otp);
      console.log("Email sent Successfully for email: ", this.email);
      next();
      return mailResponse; // Return the mailResponse after sending the email successfully
    } catch (error) {
      console.error(
        "Error occurred while sending email for email: ",
        this.email,
        " Error: ",
        error
      );
      throw error; // Throw the error if sending the email fails
    }
  }
  next();
});

module.exports = mongoose.model("OTP", otpSchema);
