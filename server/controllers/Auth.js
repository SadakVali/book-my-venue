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
    const { name, contactNumber, password } = req.body;

    // Validate the data
    if (!name || !contactNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "All the fields are required",
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
      role: ACCOUNT_TYPE.MANAGER,
      password,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
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
    const user = await User.findOne({ contactNumber })
      .populate({ path: "venue", populate: { path: "address" } })
      .exec();
    if (!user)
      return res.status(401).json({
        success: false,
        message: "Managers is not registered, Please signup to continue",
      });
    if (user.role !== ACCOUNT_TYPE.MANAGER)
      return res.status(403).json({
        success: false,
        message: "Access forbidden. Only Managers are allowed to log in.",
      });

    // validate password using constant-time comparison
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    // generate JWT token
    const payload = {
      id: user._id,
      contactNumber: user.contactNumber,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // set cookie for token and send success response
    const options = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    const userRes = {
      token,
      id: user._id,
      role: user.role,
      name: user.name,
      contactNumber: user.contactNumber,
      image: user.image,
      // bookings: user.bookings,
    };
    res
      .cookie("token", token, options)
      .status(200)
      .json({
        success: true,
        data: {
          user: userRes,
          venue: user.venue,
          token,
        },
        message: "",
      });
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
