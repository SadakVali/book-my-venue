// Importing the utility snippets
import { uploadFilesToCloudinary } from "../utils/uploadFilesToCloudinary";
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

    // Set default status to "Draft"
    const status = "Draft";

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

    // TODO:Upload images to Cloudinary
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
    // Validate and extract the functionHallId from the request parameters
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

// Edit a single function hall details
exports.editFunctionHall = async (req, res) => {
  try {
    // Validate and extract the functionHallId from the request body
    const { functionHallId } = req.body;
    if (!functionHallId) {
      return res.status(400).json({
        success: false,
        message: "functionHallId must be provided in the request body",
      });
    }

    // Find the course by its functionHallId
    const existingFunctionHall = await FunctionHall.findById(functionHallId);
    if (!existingFunctionHall) {
      return res.status(404).json({
        success: false,
        message: `FunctionHall with functionHallId ${functionHallId} not found`,
      });
    }

    // Extract all possible fields from the FunctionHall schema
    const functionHallFields = Object.keys(existingFunctionHall._doc);
    // Iterate through the FunctionHall fields and update if non-null values are present in req.body
    functionHallFields.forEach(async (field) => {
      if (
        req.body[field] !== undefined &&
        req.body[field] !== null &&
        field !== "images" &&
        field !== "video"
      ) {
        existingFunctionHall[field] = req.body[field];
      }
      if (field === "video" && req.files && req.files[field]) {
        public_ids = [existingFunctionHall[field].publicId];
        const uploadedFilesDetails = await uploadFilesToCloudinary(
          req.files[field],
          process.env.FOLDER_NAME,
          public_ids
        );
        existingFunctionHall.video.url = uploadedFilesDetails.secure_url;
        existingFunctionHall.video.publicId = uploadedFilesDetails.public_id;
        existingFunctionHall.video.duration = uploadedFilesDetails.duration;
      }

      if (field === "images") {
        public_ids = existingFunctionHall[field].map((image) => image.publicId);
        const uploadedFilesDetails = await uploadFilesToCloudinary(
          req.files[field],
          process.env.FOLDER_NAME,
          public_ids
        );
        existingFunctionHall.images = uploadedFilesDetails.map((imgRes) => {
          return { url: imgRes.secure_url, publicId: imgRes.public_id };
        });
      }
    });

    // Save the updated FunctionHall document
    const updatedFunctionHall = await existingFunctionHall.save();

    const subSchemaFieldsToUpdate = [
      "food",
      "alcohol",
      "decoration",
      "otherPolicies",
      "address",
      "manager",
    ];
    // Iterate through the sub-schema fields and update if non-null values are present in req.body
    subSchemaFieldsToUpdate.forEach(async (subSchemaId) => {
      // Access the Address subdocument within the FunctionHall
      const newSubSchema = existingFunctionHall[subSchemaId];
      // Extract all possible fields from the Address sub-schema
      const newSubSchemaFields = Object.keys(newSubSchema._doc);
      // Iterate through the Address sub-schema fields and update if non-null values are present in req.body
      newSubSchemaFields.forEach((field) => {
        if (req.body[field] !== undefined && req.body[field] !== null) {
          newSubSchema[field] = req.body[field];
        }
      });
      // Save the updated Address sub-document
      await newSubSchema.save();
    });

    // Return the response with the updated existingFunctionHall details
    return res.status(200).json({
      success: true,
      message: "Function Hall Details Updated Successfully",
      data: updatedFunctionHall,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the existingFunctionHall",
      error: error.message,
    });
  }
};

// Fetch available halls on specified dates, months & years
