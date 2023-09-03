// importing the packages
const cloudinary = require("cloudinary").v2;

// importing the configuration
require("dotenv").config();

exports.cloudinaryConnect = async () => {
  try {
    cloudinary.config({
      // Configuring the cloudinary to upload MEDIA
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
  } catch (error) {
    console.error(error);
  }
};
