// importing the packages
const mongoose = require("mongoose");

exports.connect = async () => {
  try {
    // Connect to the MongoDB Atlas Cloud Database
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Log success message
    console.log("MongoDB Atlas Cloud Database connection successful");
  } catch (error) {
    // Log error message
    console.log("MongoDB Atlas Cloud Database Connection Failed");
    // Throw the error for the calling code to handle
    throw error;
  }
};
