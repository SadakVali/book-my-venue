// Importing the utility snippets
import { uploadFileToCloudinary } from "../utils/uploadFileToCloudinary";
import { convertSecondsToDuration } from "../utils/secToDuration";

// Importing the models
import User from "../models/User";
import Course from "../models/Course";
import Category from "../models/Category";
import Chapter from "../models/Chapter";
import Video from "../models/Video";
import CourseProgress from "../models/CourseProgress";

// Create a new course handler function
exports.createCourse = async (req, res) => {
  try {
    // Destructure data from the request body
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      tags,
      status,
      instructions,
    } = req.body;

    // Validate required fields
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tags ||
      !req?.files?.thumbnailImage || // Use optional chaining for safer thumbnailImage access
      !category
    )
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });

    // Set default status to "Draft" if not provided
    if (!status) status = "Draft";

    // Check if the user is an instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    });
    console.log("Instructor Details", instructorDetails);
    if (!instructorDetails)
      return res.status(404).json({
        success: false,
        message: "Instructor details not found",
      });

    // Check if the given category is valid or not
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category details not found",
      });
    }

    // Upload image to Cloudinary
    const thumbnailImage = await uploadFileToCloudinary(
      req.files.thumbnailImage,
      process.env.FOLDER_NAME
    );
    console.log("Thumbnail Image Details", thumbnailImage);

    // Create a new course entry
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: userId,
      whatYouWillLearn,
      price,
      tags,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status,
      instructions,
    });

    // Add the new course to the user doc of Instructor
    await User.findByIdAndUpdate(
      userId,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // Update the category schema
    await Category.findByIdAndUpdate(
      category,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // Return new course and success response
    return res.status(201).json({
      success: true,
      message: "Course Created Successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// Fetch all published courses handler function
exports.getAllPublishedCoursesInThePlatform = async (req, res) => {
  try {
    // Retrieve all published courses with specific fields
    const allCourses = await Course.find(
      { status: "Published" },
      "courseName price thumbnail instructor ratingAndReviews studentsEnrolled"
    )
      .populate("instructor")
      .exec();

    // Return a successful response with the course data
    return res.status(200).json({
      success: true,
      message: "All courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    console.error(error);
    // Return an error response with an appropriate status code and error message
    return res.status(500).json({
      success: false,
      message: "Unable to fetch courses data",
      error: error.message,
    });
  }
};

// Get all course details of a single course with detailed information instead of ObjectIds
exports.getSingleCourseDetails = async (req, res) => {
  try {
    // Validate and extract the courseId from the request parameters
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "CourseId must be provided in the request body",
      });
    }

    // Fetch details of the published course
    const courseDetails = await Course.findById(courseId)
      .where("status")
      .equals("Published")
      .populate("category")
      .populate("ratingAndReviews")
      .populate({ path: "instructor", populate: { path: "additionalDetails" } })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl", // Select only specific fields, excluding 'videoUrl'
        },
      })
      .exec();

    // Validation: Check if the course was found
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: `Course with courseId ${courseId} not found`,
      });
    }

    // Additional validation (if necessary):
    if (courseDetails.status === "Draft") {
      return res.status(403).json({
        success: false,
        message: "Accessing a draft course is forbidden",
      });
    }

    // Calculate total course duration in human-readable format
    let totalCourseDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) =>
      content.subSection.forEach((subSection) => {
        totalCourseDurationInSeconds += parseInt(subSection.timeDuration);
      })
    );
    const totalCourseDuration = convertSecondsToDuration(
      totalCourseDurationInSeconds
    );

    // Return the response with course details and total duration
    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: { courseDetails, totalCourseDuration },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching a single course details",
      error: error.message,
    });
  }
};

// Edit a single course details
exports.editCourse = async (req, res) => {
  try {
    // Validate and extract the courseId from the request body
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "CourseId must be provided in the request body",
      });
    }

    // Find the course by its courseId
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course with courseId ${courseId} not found`,
      });
    }

    // If a thumbnail image is found in the request, update it
    if (req.files && req.files.thumbnailImage) {
      const thumbnailImage = req.files.thumbnailImage;
      const thumbnailResponse = await uploadFileToCloudinary(
        thumbnailImage,
        process.env.FOLDER_NAME
      );
      course.thumbnail = thumbnailResponse.secure_url;
    }

    // Update fields that are present in the request body
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(req.body[key]);
        } else {
          course[key] = req.body[key];
        }
      }
    }

    // Save the updated course to the database
    await course.save();

    // Fetch the updated details of the course with populated data
    const updatedCourseDetails = await Course.findById(courseId)
      .populate("category")
      .populate("ratingAndReviews")
      .populate({ path: "instructor", populate: { path: "additionalDetails" } })
      .populate({ path: "chapters", populate: { path: "videos" } })
      .exec();

    // Return the response with the updated course details
    return res.status(200).json({
      success: true,
      message: "Course Updated Successfully",
      data: updatedCourseDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the course",
      error: error.message,
    });
  }
};

// Get full single course details
exports.getFullSingleCourseDetails = async (req, res) => {
  try {
    // Validate and extract the courseId from the request body
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "CourseId must be provided in the request body",
      });
    }

    // Validate and extract the userId from the authenticated user (assuming req.user is set)
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message:
          "User ID is missing in the request or user is not authenticated",
      });
    }

    // Fetch full details of the course with populated data
    const courseDetails = await Course.findById(courseId)
      .populate("category")
      .populate("ratingsAndReviews")
      .populate({ path: "instructor", populate: { path: "additionalDetails" } })
      .populate({ path: "chapters", populate: { path: "videos" } })
      .exec();

    // Validate if the course was found
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: `Course with courseId ${courseId} not found`,
      });
    }

    // Calculate the total duration of the course
    let totalCourseDurationInSeconds = 0;
    courseDetails.chapters.forEach((chapter) => {
      chapter.videos.forEach((video) => {
        totalCourseDurationInSeconds += parseInt(video.timeDuration);
      });
    });
    const totalCourseDuration = convertSecondsToDuration(
      totalCourseDurationInSeconds
    );

    // Fetch the course progress for the given course and user
    const courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    });

    // Return the response with the full course details, total duration, and completed videos (if available)
    return res.status(200).json({
      success: true,
      message: "Successfully fetched all the course details",
      data: {
        courseDetails,
        totalCourseDuration,
        completedVideos: courseProgress?.completedVideos || [], // If courseProgress is not found, default to an empty array
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching the complete course details with courseProgress",
      error: error.message,
    });
  }
};

// List courses of a given instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user
    const instructorId = req.user?.id; // Use optional chaining to handle cases where user is not authenticated

    // Validate if the instructor ID exists
    if (!instructorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Please log in to access instructor courses.",
      });
    }

    // Find all the courses belonging to the instructor
    const instructorCourses = await Course.find({ instructor: instructorId })
      .sort({ createdAt: -1 })
      .lean(); // Use .lean() for performance improvement since we only need the JSON data

    // Check if any courses were found
    if (!instructorCourses || instructorCourses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found for the instructor.",
      });
    }

    // Return the list of courses
    return res.status(200).json({
      success: true,
      message: "Successfully fetched all the courses of the instructor.",
      data: instructorCourses,
    });
  } catch (error) {
    console.error(error);

    // Handle other errors
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the instructor courses.",
      error: error.message,
    });
  }
};

// Delete the course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Validate input: courseId must be provided
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is missing in the request body.",
      });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Unable to find the course with the given courseId: ${courseId}`,
      });
    }

    // Unenroll the students from the course
    const studentsEnrolled = course.studentsEnrolled;
    // for (const studentId of studentsEnrolled)
    //   await User.findByIdAndUpdate(studentId, { $pull: { courses: courseId } });
    await User.updateMany(
      { _id: { $in: studentsEnrolled } },
      { $pull: { courses: courseId } }
    );

    // Delete the chapters and videos
    for (const chapterId of course.chapters) {
      // Fetch the chapter object
      const chapter = await Chapter.findById(chapterId);
      if (chapter) {
        await Video.deleteMany({ _id: { $in: chapter.videos } });
      }
      // Delete the section
      await Chapter.findByIdAndDelete(chapterId);
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Successfully deleted all the course details.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the course details.",
      error: error.message,
    });
  }
};
