// Importing the utility snippets
import { uploadFileToCloudinary } from "../utils/uploadFileToCloudinary";
import { convertSecondsToDuration } from "../utils/secToDuration";

// Importing the models
import User from "../models/User";
import FunctionHall from "../models/FunctionHall";
import Food from "../models/Food";
import Alcohol from "../models/Alcohol";
import Decor from "../models/Decor";
import OtherPolicies from "../models/OtherPolicies";
import Address from "../models/Address";
import GPS from "../models/GPS";

// Create a new function hall handler function
exports.createFunctionHall = async (req, res) => {
  try {
    // Destructure data from the request body
    const {
      name,
      aboutVenue,
      pricePerDay,
      advancePercentage,
      guestCapacity,
      carParkingSpace,
      lodgingRooms,
      roomPrice,
      bookingCancellation,
      status,
      // Food
      cateringProvidedByVenue,
      outsideCatererAllowed,
      nonVegAllowedAtVenue,
      vegPricePerPlate,
      NonvegPricePerPlate,
      // Alcohol
      alcoholProvidedByVenue,
      outsideAlcoholAllowed,
      // Decor
      decorProvidedByVenue,
      outsideDecoratersAllowed,
      // OtherPolicies
      isMusicAllowedLateAtNight,
      isHallAirConditioned,
      isBaaratAllowed,
      fireCrackersAllowed,
      isHawanAllowed,
      isOverNightWeddingAllowed,
      // Address
      street,
      landmark,
      distanceFromLandmark,
      village,
      city,
      pin,
      // GPS
      coordinates,
    } = req.body;

    // Validate required fields
    if (
      !req?.files?.images || // Use optional chaining for safer thumbnailImage access
      !req?.files?.video ||
      !name ||
      !aboutVenue ||
      !pricePerDay ||
      !advancePercentage ||
      !guestCapacity ||
      !carParkingSpace ||
      !lodgingRooms ||
      !roomPrice ||
      !bookingCancellation ||
      !status ||
      // Food
      !cateringProvidedByVenue ||
      !outsideCatererAllowed ||
      !nonVegAllowedAtVenue ||
      !vegPricePerPlate ||
      !NonvegPricePerPlate ||
      // Alcohol
      !alcoholProvidedByVenue ||
      !outsideAlcoholAllowed ||
      // Decor
      !decorProvidedByVenue ||
      !outsideDecoratersAllowed ||
      // OtherPolicies
      !isMusicAllowedLateAtNight ||
      !isHallAirConditioned ||
      !isBaaratAllowed ||
      !fireCrackersAllowed ||
      !isHawanAllowed ||
      !isOverNightWeddingAllowed ||
      // Address
      !street ||
      !landmark ||
      !distanceFromLandmark ||
      !village ||
      !city ||
      !pin ||
      // GPS
      !coordinates
    )
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });

    // Set default status to "Draft" if not provided
    if (!status) status = "Draft";

    // Check if the user is an instructor
    const managerId = req.user.id;
    const managerDetails = await User.findById(managerId, {
      role: "Manager",
    });
    console.log("Manager Details", managerDetails);
    if (!managerDetails)
      return res.status(404).json({
        success: false,
        message: "Manager details not found",
      });

    // make sure there is no functionhall registered with the given managerId earlier
    if (managerDetails.FunctionHall.length)
      return req.status(401).json({
        success: false,
        message: "FunctionHall is already registered with this ManagerId",
      });

    // Upload images to Cloudinary
    const imagesResponse = await uploadFileToCloudinary(
      req?.files?.images,
      process.env.FOLDER_NAME
    );
    console.log("Uploaded Images Details", imagesResponse);

    // Upload video to Cloudinary
    const videoResponse = await uploadFileToCloudinary(
      req?.files?.video,
      process.env.FOLDER_NAME
    );
    console.log("Uploaded Video Details", videoResponse);

    // Create a new Food entry
    const newFoodEntry = await Food.create({
      cateringProvidedByVenue,
      outsideCatererAllowed,
      nonVegAllowedAtVenue,
      vegPricePerPlate,
      NonvegPricePerPlate,
    });

    // Create a new Alcohol entry
    const newAlcoholEntry = await Alcohol.create({
      alcoholProvidedByVenue,
      outsideAlcoholAllowed,
    });

    // Create a new Decor entry
    const newDecorEntry = await Decor.create({
      decorProvidedByVenue,
      outsideDecoratersAllowed,
    });

    // Create a new OtherPolicies entry
    const newOtherPoliciesEntry = await OtherPolicies.create({
      isMusicAllowedLateAtNight,
      isHallAirConditioned,
      isBaaratAllowed,
      fireCrackersAllowed,
      isHawanAllowed,
      isOverNightWeddingAllowed,
    });

    // Create a new Address entry
    const newAddressEntry = await Address.create({
      street,
      landmark,
      distanceFromLandmark,
      village,
      city,
      pin,
      GPS: newGPSEntry._id,
    });

    // Create a new GPS entry
    const newGPSEntry = await GPS.create({
      location: {
        type: "Point",
        coordinates,
      },
    });

    // Create a new course entry
    const newCourse = await FunctionHall.create({
      name,
      aboutVenue,
      pricePerDay,
      advancePercentage,
      guestCapacity,
      carParkingSpace,
      lodgingRooms,
      roomPrice,
      bookingCancellation,
      status,
      food: newFoodEntry._id,
      alcohol: newAlcoholEntry._id,
      decoration: newDecorEntry._id,
      otherPolicies: newOtherPoliciesEntry._id,
      address: newAddressEntry._id,
    });

    // Add the new course to the user doc of Instructor
    await User.findByIdAndUpdate(
      managerId,
      { $push: { functionHall: newCourse._id } },
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

// Get all details of a single function hall with detailed information instead of ObjectIds
exports.getSingleFunctionHallDetails = async (req, res) => {
  try {
    // Validate and extract the courseId from the request parameters
    const { functionHallId } = req.body;
    if (!functionHallId) {
      return res.status(400).json({
        success: false,
        message: "functionHallId must be provided in the request body",
      });
    }

    // Fetch details of the published Function Hall
    const functionHallDetails = await FunctionHall.findById(functionHallId)
      .where("status")
      .equals("Published")
      .populate("food")
      .populate("alcohol")
      .populate("decoration")
      .populate("otherPolicies")
      .populate("bookingDates")
      .populate({ path: "address", populate: { path: "GPS" } })
      .exec();

    // Validation: Check if the functionHallDetails was found
    if (!functionHallDetails) {
      return res.status(404).json({
        success: false,
        message: `Function Hall with functionHallId ${functionHallId} not found`,
      });
    }

    // Return the response with course details and total duration
    return res.status(200).json({
      success: true,
      message: "Function Hall details fetched successfully",
      data: functionHallDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching a single Function Hall details",
      error: error.message,
    });
  }
};
// // Get full single FunctionHall details
// exports.getFullSingleFunctionHallDetails = async (req, res) => {
//   try {
//     // Validate and extract the courseId from the request body
//     const { courseId } = req.body;
//     if (!courseId) {
//       return res.status(400).json({
//         success: false,
//         message: "CourseId must be provided in the request body",
//       });
//     }

//     // Validate and extract the userId from the authenticated user (assuming req.user is set)
//     const userId = req.user?.id;
//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "User ID is missing in the request or user is not authenticated",
//       });
//     }

//     // Fetch full details of the course with populated data
//     const courseDetails = await Course.findById(courseId)
//       .populate("category")
//       .populate("ratingsAndReviews")
//       .populate({ path: "instructor", populate: { path: "additionalDetails" } })
//       .populate({ path: "chapters", populate: { path: "videos" } })
//       .exec();

//     // Validate if the course was found
//     if (!courseDetails) {
//       return res.status(404).json({
//         success: false,
//         message: `Course with courseId ${courseId} not found`,
//       });
//     }

//     // Calculate the total duration of the course
//     let totalCourseDurationInSeconds = 0;
//     courseDetails.chapters.forEach((chapter) => {
//       chapter.videos.forEach((video) => {
//         totalCourseDurationInSeconds += parseInt(video.timeDuration);
//       });
//     });
//     const totalCourseDuration = convertSecondsToDuration(
//       totalCourseDurationInSeconds
//     );

//     // Fetch the course progress for the given course and user
//     const courseProgress = await CourseProgress.findOne({
//       courseId,
//       userId,
//     });

//     // Return the response with the full course details, total duration, and completed videos (if available)
//     return res.status(200).json({
//       success: true,
//       message: "Successfully fetched all the course details",
//       data: {
//         courseDetails,
//         totalCourseDuration,
//         completedVideos: courseProgress?.completedVideos || [], // If courseProgress is not found, default to an empty array
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message:
//         "Something went wrong while fetching the complete course details with courseProgress",
//       error: error.message,
//     });
//   }
// };

// Edit a single function hall details
exports.editFunctionHall = async (req, res) => {
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

// Fetch available halls on specified dates, months & years
