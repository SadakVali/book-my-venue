// const packages
const jwt = require("jsonwebtoken");

// Constants
const TOKEN_MISSING_MESSAGE = "Token is missing";
const TOKEN_INVALID_MESSAGE = "Token is invalid";

// Authentication Middleware
exports.auth = async (req, res, next) => {
  try {
    // Extract token = require(request headers, cookies, or body
    const token =
      (req.headers.authorization &&
        req.headers.authorization.replace("Bearer ", "")) ||
      req.cookies.token ||
      req.body.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: TOKEN_MISSING_MESSAGE,
      });
    }

    try {
      // Verify the JWT token using the secret key stored in the environment variables
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Store the decoded JWT payload in the request object for further use
      req.user = decoded;
      console.log(req.user);
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: TOKEN_INVALID_MESSAGE,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message:
        "Something went wrong While checking the authentication of the Manager",
      error: error.message,
    });
  }
};

// isAuthorized middleware
exports.isAuthorized = async (req, res, next) => {
  try {
    // Validate req.user and account type existence
    if (!req.user || !req.user.venue) {
      return res.status(401).json({
        success: false,
        message: "Invalid request. User not authenticated.",
      });
    }

    // Check if the user is a Admin
    if (req.user.venue !== req.body.venue) {
      return res.status(403).json({
        success: false,
        message: "You are not the Manager of this Venue.",
      });
    }

    // Proceed to the next middleware if the user is indeed manager of the functionhall that he claims
    return next();
  } catch (error) {
    console.error("Error verifying Manager Authorization:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while verifying Manager Authorization.",
      error: error.message,
    });
  }
};
