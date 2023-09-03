// packages
import bcrypt from "bcrypt";
import crypto from "crypto";

// models
import User from "../models/User";

// utility code snippets
import sendMail from "../utils/sendMail";

// Function to reset password
exports.resetPasswordToken = async (req, res) => {
  try {
    // Get email from the request body
    const { email } = req.body;

    // Check if the user exists in the DB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Your email is not registered with us, enter a valid email",
      });
    }

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString("hex");

    // Update user by adding token and expiration time
    const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes from now
    const updatedUserDetails = await User.findOneAndUpdate(
      { email },
      { token, resetPasswordExpires: expirationTime },
      { new: true }
    );

    // Generate frontend UI url
    const url = `http://localhost:3000/api/v1/auth/reset-password/${token}`;
    // const url = `https://studynotion-edtech-project.vercel.app/update-password/${token}`

    // Send mail containing the URL
    await sendMail(
      email,
      "Password Reset Link",
      `<div>
        <p>Password Reset Link is: </p>
        <br/>
        <a href=${url} target="_blank">${url}</a>
        <br/>
        <p>Please click on this link to reset your password.</p>
      </div>`
    );

    // Return response
    return res.status(200).json({
      success: true,
      message:
        "Email sent successfully, Please check email and change the password",
      url: url,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while creating and sending the password reset link",
      error: error.message,
    });
  }
};

// resetPassword
exports.resetPassword = async (req, res) => {
  try {
    // Destructure the data from the request body
    const { password, confirmPassword, token } = req.body;

    // Validate password and confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match in resetPassword",
      });
    }

    // Find the user using the token
    const user = await User.findOne({ token });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid token in the reset password link",
      });
    }

    // Check if the token has expired
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token has expired. Please regenerate the token",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password in the database
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    // Return response
    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the reset password",
      error: error.message,
    });
  }
};
