// model schemas
import Video from "../models/Video";
import Chapter from "../models/Chapter";

// utility snippets
import { uploadFileToCloudinary } from "../utils/fileUploader";

// create a new Video under a given chapter
exports.createVideo = async (req, res) => {
  try {
    // Fetch data from req body
    const { chapterId, title, description } = req.body;

    // Extract video file from request
    const video = req.files.video;

    // Validate input fields
    if (!chapterId || !title || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Upload video to cloudinary and get video details
    const uploadedVideoDetails = await uploadFileToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    // Create a Video schema entry
    const newlyCreatedVideo = await Video.create({
      title,
      description,
      timeDuration: uploadedVideoDetails.duration,
      videoUrl: uploadedVideoDetails.secure_url,
    });

    // Update the Chapter schema with this Video objectId
    const updatedChapterDetails = await Chapter.findByIdAndUpdate(
      chapterId,
      { $push: { videos: newlyCreatedVideo._id } },
      { new: true }
    )
      .populate("videos")
      .exec();

    // Return response
    return res.status(201).json({
      success: true,
      message: "Video created successfully",
      data: updatedChapterDetails,
    });
  } catch (error) {
    console.error("Error occured while creating a new video", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error from createVideo handler",
    });
  }
};

// Update a Video Document
exports.updateVideo = async (req, res) => {
  try {
    // Fetch data from req body
    const { chapterId, videoId, title, description } = req.body;

    // Validate input fields
    if (!chapterId || !videoId) {
      return res.status(400).json({
        success: false,
        message: "Both chapterId and videoId are required.",
      });
    }

    // Fetch video details and validate
    const videoDetails = await Video.findById(videoId);
    if (!videoDetails) {
      return res.status(404).json({
        success: false,
        message: "Video not found with the provided videoId.",
      });
    }

    // Update each property of a Video document, if it is given
    if (title) {
      videoDetails.title = title;
    }
    if (description) {
      videoDetails.description = description;
    }
    if (req.files && req.files.video) {
      const uploadedVideoDetails = await uploadFileToCloudinary(
        req.files.video,
        process.env.FOLDER_NAME
      );
      videoDetails.videoUrl = uploadedVideoDetails.secure_url;
      videoDetails.timeDuration = uploadedVideoDetails.duration;
    }

    // Save the updated Video details
    await videoDetails.save();

    // Fetch the updated Chapter and populate video
    const updatedChapter = await Chapter.findById(chapterId).populate("video");

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Video updated successfully",
      data: updatedChapter,
    });
  } catch (error) {
    console.error("ERror occured while updating the video content", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the subsection",
    });
  }
};

// HW: deleteVideo
exports.deleteVideo = async (req, res) => {
  try {
    // Fetch the data from the request body and validate inputs
    const { chapterId, videoId } = req.body;
    if (!chapterId || !videoId) {
      return res.status(400).json({
        success: false,
        message: "Both chapterId and videoId are required.",
      });
    }

    // Delete videoId from the Chapter collection
    const updatedChapter = await Chapter.findByIdAndUpdate(
      chapterId,
      { $pull: { videos: videoId } },
      { new: true } // Return the updated document
    );

    if (!updatedChapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter document not found",
      });
    }

    // Delete the video document from the videos array field
    const deletedVideo = await Video.findByIdAndDelete(videoId);
    if (!deletedVideo) {
      return res.status(404).json({
        success: false,
        message: "Video document not found",
      });
    }

    // Return success response with updatedChapter
    return res.status(200).json({
      success: true,
      message: "Video deleted successfully",
      data: updatedChapter, // Use the updated document from the Chapter array
    });
  } catch (error) {
    console.error("Error occured while deleting a video", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the video document",
    });
  }
};
