// importing models
import Profile from "../models/Profile";
import User from "../models/User";
import Course from "../models/Course";
import CourseProgress from "../models/CourseProgress";

// importing utility snippets
import { uploadFileToCloudinary } from "../utils/uploadFileToCloudinary";
import { convertSecondsToDuration } from "../utils/convertSecondsToDuration";

// Update the additional details of the user
exports.updateProfile = async (req, res) => {
  try {
    // Extract additional data from the request body and validate inputs
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      gender = "",
      contactNumber = "",
    } = req.body;

    // Get userID from req.user.id
    const userId = req.user?.id;
    if (!userId)
      return res.status(400).json({
        success: false,
        message: "Invalid request. User ID not provided.",
      });

    // Find the user document and update basic details
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName },
      { new: true }
    );

    // Find the profile schema objectId associated with the user
    const profileId = updatedUser.additionalDetails;

    // Update the profile object
    // const profileDetails = await Profile.findById(profileId);
    // profileDetails.gender = gender;
    // profileDetails.contactNumber = contactNumber;
    // profileDetails.about = about;
    // profileDetails.dateOfBirth = dateOfBirth;
    // await profileDetails.save();
    const updatedProfileDetails = await Profile.findByIdAndUpdate(
      profileId,
      { gender, contactNumber, about, dateOfBirth },
      { new: true }
    );

    // Find the updated user with populated additionalDetails
    const user = await User.findById(userId).populate("additionalDetails");

    // Return success response with updated user data
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error occured in the updateProfile controller", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the profile",
    });
  }
};

// Delete account handler
// TODO: Explore Scheduling this job to run after 5 days from the time of request generated
exports.deleteAccount = async (req, res) => {
  try {
    // TODO: know about cron job
    // TODO: Find More on Job Schedule
    // const job = schedule.scheduleJob("10 * * * * *", function () {
    // 	console.log("The answer to life, the universe, and everything!");
    // });
    // console.log(job);

    // Fetch the userId from the authenticated user
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid request. User ID not provided.",
      });
    }

    // Check if the user details exist
    const userDetails = await User.findById(userId);
    if (!userDetails)
      return res.status(404).json({
        success: false,
        message: "User details not found",
      });

    // Delete the profile object related to this userId
    await Profile.findByIdAndDelete(userDetails.additionalDetails);

    // Remove the userId from the studentsEnrolled array of all enrolled courses
    await Course.updateMany(
      { studentsEnrolled: userId },
      { $pull: { studentsEnrolled: userId } }
    );

    // Delete the user object related to the userId
    await User.findByIdAndDelete(userId);

    // Return success response after successful account deletion
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error occured in the deleteAccount controller", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the account",
    });
  }
};

// Get all user details
exports.getAllUserDetails = async (req, res) => {
  try {
    // Get userId from the authenticated user
    const userId = req.user?.id;
    if (!userId)
      return res.status(400).json({
        success: false,
        message: "Invalid request. User ID not provided.",
      });

    // Populate userDetails with additionalDetails
    const userDetails = await User.findById(userId)
      .populate("additionalDetails")
      .exec();
    // Check if userDetails exists
    if (!userDetails)
      return res.status(404).json({
        success: false,
        message: `Unable to fetch the user with the given userId: ${userId}`,
      });

    // Return success response with user details
    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    console.error(
      "An error occured in the getAllUserDetails controller",
      error
    );
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the user account details",
    });
  }
};

// Update the display picture in the user schema object
exports.updateDisplayPicture = async (req, res) => {
  try {
    // Validate input and fetch the display picture and userId
    const displayPicture = req.files?.displayPicture;
    const userId = req.user?.id;
    if (!displayPicture || !userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid request. Display picture or user ID not provided.",
      });
    }

    // Upload image to cloudinary
    const image = await uploadFileToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    // console.log("Uploaded image details", image);

    // Update the user's display picture in the DB
    const updatedUserDetails = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    ).populate("additionalDetails");

    // Check if userDetails exists
    if (!updatedUserDetails)
      return res.status(404).json({
        success: false,
        message: `Unable to fetch the user details with given userId: ${userId}`,
      });

    // Return success response with updated user details
    return res.status(200).json({
      success: true,
      message: "Display image updated successfully",
      data: updatedUserDetails,
    });
  } catch (error) {
    console.error(
      "An error occured in the updateDisplayPicture controller",
      error
    );
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating the display picture",
    });
  }
};
