// importing models
import User from "../models/User";
import BookingInfo from "../models/BookingInfo";

// Delete account handler
exports.deleteAccount = async (req, res) => {
  try {
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

    // Remove the userId from the studentsEnrolled array of all enrolled courses
    await BookingInfo.deleteMany({ functionHall: userDetails.functionHall[0] });

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
      .populate("functionHall")
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
