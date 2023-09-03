// Import packages using ES6 modules
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";

// Import models using ES6 modules
import User from "../models/User";
import OTP from "../models/OTP";
import Profile from "../models/Profile";

// Import utility snippets using ES6 modules
import sendMail from "../utils/sendMail";
import { passUpdNotifiTemp } from "../mail/templates/passUpdNotifiTemp";

// controller to send the otp to the email and also for email verification
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    // Validate email input
    if (!email || typeof email !== "string")
      return res.status(400).json({
        success: false,
        message: "Invalid email provided",
      });

    // Check if the user already exists or not
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(409).json({
        success: false,
        message: "User Already Registered with this email",
      });
    }

    // Generate a unique OTP
    const otpOptions = {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    };
    let otp;
    let existingOTP = true;
    // Check unique otp or not
    while (existingOTP) {
      otp = otpGenerator.generate(6, otpOptions);
      existingOTP = await OTP.findOne({ otp });
    }

    // Create an entry in the database for OTP model
    try {
      await OTP.create({ email, otp });
      // Return the response
      return res.status(200).json({
        success: true,
        message: "OTP Sent Successfully",
      });
    } catch (error) {
      // Handle OTP creation error
      console.error("Error in creating OTP:", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong in creating the OTP",
        error: error.message,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong in sending the OTP",
      error: error.message,
    });
  }
};

// signup controller to register users
exports.signup = async (req, res) => {
  try {
    // Destructure data from the body of the request
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
    } = req.body;

    // Validate the data
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All the fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and ConfirmPassword values do not match.",
      });
    }

    // Check if user is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already registered. Please sign in to continue.",
      });
    }

    // Find most recent OTP for the user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    if (recentOtp.length === 0 || otp !== recentOtp[0]?.otp) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create additional profile details of the user
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    // Create an entry in DB with user details
    let approved = true; // Assuming all users are approved by default

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      accountType,
      approved,
      // password: hashedPassword,
      password,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User could not be registered. Please try again.",
      error: error.message,
    });
  }
};

// login controller for authenticating users
exports.login = async (req, res) => {
  try {
    // get email and password from request body
    const { email, password } = req.body;

    // validate the data
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required, please try again",
      });
    }

    // check if user exists or not
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, Please signup to continue",
      });
    }

    // validate password using constant-time comparison
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    // generate JWT token
    try {
      const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      user.token = token;
      user.password = undefined;

      // set cookie for token and send success response
      const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        data: user,
        message: "User Logged in successfully",
      });
    } catch (error) {
      throw new Error("Failed to generate token.");
    }
  } catch (error) {
    // return 500 internal server error status code with generic error message
    console.error("Login Failed:", error);
    return res.status(500).json({
      success: false,
      message: "Login Failed, please try again",
      error: error,
    });
  }
};

// change password
exports.changePassword = async (req, res) => {
  try {
    // Ensure all required fields are provided in the request body
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide old password, new password, and confirm password",
      });
    }

    // Get the user details
    const userId = req.user.id;
    const userDetails = await User.findById(userId);

    // Validation old password
    const isPasswordMatch = bcrypt.compareSync(
      oldPassword,
      userDetails.password
    );
    // If password doesn't match, return 401 Unauthorized error
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "The Password is incorrect",
      });
    }

    // Match the new password with confirm password
    if (newPassword !== confirmPassword) {
      // Return a 400 Bad Request error
      return res.status(400).json({
        success: false,
        message: "The New Password and Confirm Password do not match",
      });
    }

    // Update hashed password in DB
    // const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      userId,
      // { password: encryptedPassword },
      { password },
      { new: true }
    ).populate("additionalDetails");

    // Send password updated notification mail
    try {
      await sendMail(
        updatedUserDetails.email,
        "From CodeHelp - Password updated Successfully",
        passUpdNotifiTemp(
          updatedUserDetails.email,
          `${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
    } catch (error) {
      // Log the error and return a 500 (Internal Server Error) error
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Error Occurred while sending the email",
        error: error.message,
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: {
        firstName: updatedUserDetails.firstName,
        lastName: updatedUserDetails.lastName,
        email: updatedUserDetails.email,
        additionalDetails: updatedUserDetails.additionalDetails,
      },
    });
  } catch (error) {
    // If an error occurs while updating the password, log the error and
    // return a 500 (Internal Server) error
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error Occurred while updating the password",
      error: error.message,
    });
  }
};
