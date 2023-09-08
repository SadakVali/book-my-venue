// Import packages using ES6 modules
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Import models using ES6 modules
const User = require("../models/User");

const { ACCOUNT_TYPE } = require("../utils/constants");

// signup controller to register users
exports.signup = async (req, res) => {
  try {
    // Destructure data = require(the body of the request
    const {
      name,
      contactNumber,
      confirmContactNumber,
      alternateContactNumber,
      confirmAlternateContactNumber,
      password,
      confirmPassword,
    } = req.body;

    // Validate the data
    if (
      !name ||
      !contactNumber ||
      !confirmContactNumber ||
      !alternateContactNumber ||
      !confirmAlternateContactNumber ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All the fields are required",
      });
    }

    if (contactNumber !== confirmContactNumber) {
      return res.status(400).json({
        success: false,
        message: "contactNumber and confirmContactNumber values do not match.",
      });
    }

    if (alternateContactNumber !== confirmAlternateContactNumber) {
      return res.status(400).json({
        success: false,
        message:
          "alternateContactNumber and confirmAlternateContactNumber values do not match.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and ConfirmPassword values do not match.",
      });
    }

    // Check if user is already registered
    const existingUser = await User.findOne({ contactNumber });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already registered. Please sign in to continue.",
      });
    }

    // Create an entry in DB with user details
    const user = await User.create({
      name,
      contactNumber,
      alternateContactNumber,
      role: ACCOUNT_TYPE.MANAGER,
      password,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${name} ${name}`,
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
    // get email and password = require(request body
    const { contactNumber, password } = req.body;

    // validate the data
    if (!contactNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required, please try again",
      });
    }

    // check if user exists or not
    const user = await User.findOne({ contactNumber });
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
        email: user.contactNumber,
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
