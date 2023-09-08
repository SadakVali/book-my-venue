// Importing the utility snippets
const { uploadFilesToCloudinary } = require("../utils/uploadFileToCloudinary");
// const { convertSecondsToDuration } = require("../utils/secToDuration");

// Importing the models
const User = require("../models/User");
const Venue = require("../models/FunctionHall");
const Address = require("../models/Address");

// Create a new venue handler function
exports.createVenue = async (req, res) => {
  try {
    // Destructure data = require(the request body
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
      !coordinates.length
    )
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });

    // Set default status to "Draft"
    const status = "Draft";

    // Check if the user is a manager
    const managerDetails = await User.findById(req.user.id, {
      role: "Manager",
    });
    console.log("Manager Details", managerDetails);
    if (!managerDetails)
      return res.status(404).json({
        success: false,
        message: "Manager details not found",
      });

    // make sure there is no function hall registered with the given managerId earlier
    if (managerDetails.venue)
      return req.status(401).json({
        success: false,
        message: "Venue is already registered with this ManagerId",
      });

    // Upload images to Cloudinary
    let imagesResponse;
    if (req?.files?.images) {
      imagesResponse = await uploadFilesToCloudinary(
        req?.files?.images,
        process.env.FOLDER_NAME
      );
      console.log("Uploaded Images Details", imagesResponse);
    }

    // Upload video to Cloudinary
    let videoResponse;
    if (req?.files?.video) {
      videoResponse = await uploadFilesToCloudinary(
        req?.files?.video,
        process.env.FOLDER_NAME
      );
      console.log("Uploaded Video Details", videoResponse);
    }

    // Create a new Food entry
    const newFoodEntry = {
      cateringProvidedByVenue,
      outsideCatererAllowed,
      nonVegAllowedAtVenue,
      vegPricePerPlate,
      NonvegPricePerPlate,
    };

    // Create a new Alcohol entry
    const newAlcoholEntry = {
      alcoholProvidedByVenue,
      outsideAlcoholAllowed,
    };

    // Create a new Decor entry
    const newDecorEntry = {
      decorProvidedByVenue,
      outsideDecoratersAllowed,
    };

    // Create a new OtherPolicies entry
    const newOtherPoliciesEntry = {
      isMusicAllowedLateAtNight,
      isHallAirConditioned,
      isBaaratAllowed,
      fireCrackersAllowed,
      isHawanAllowed,
      isOverNightWeddingAllowed,
    };

    // Create a new Address entry
    const newAddressEntry = await Address.create({
      street,
      landmark,
      distanceFromLandmark,
      village,
      city,
      pin,
      location: { type: "Point", coordinates: JSON.parse(coordinates) },
    });

    const zipImageArrays = (imagesResponse) => {
      const urls = imagesResponse.map((res) => res.secure_url);
      const publicIds = imagesResponse.map((res) => res.public_id);
      const result = [];
      // Assuming arr1 and arr2 have the same length
      for (let i = 0; i < urls.length; i++)
        result.push({ url: urls[i], publicId: publicIds[i] });
      return result;
    };

    const zipVideoArrays = (videoResponse) => {
      const urls = videoResponse.map((res) => res.secure_url);
      const publicIds = videoResponse.map((res) => res.public_id);
      const durations = videoResponse.map((res) => res.duration);
      const result = [];
      // Assuming arr1 and arr2 have the same length
      for (let i = 0; i < urls.length; i++)
        result.push({
          url: urls[i],
          publicId: publicIds[i],
          duration: durations[i],
        });
      return result;
    };

    // Create a new function hall entry
    const newVenueDetails = await Venue.create({
      name,
      aboutVenue,
      pricePerDay,
      manager: req.user.id,
      advancePercentage,
      images: zipImageArrays(imagesResponse),
      video: zipVideoArrays(videoResponse),
      guestCapacity,
      carParkingSpace,
      lodgingRooms,
      roomPrice,
      bookingCancellation,
      food: newFoodEntry,
      alcohol: newAlcoholEntry,
      decoration: newDecorEntry,
      otherPolicies: newOtherPoliciesEntry,
      address: newAddressEntry._id,
    });

    // Add the new function hall to the user doc of Instructor
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { venue: newVenueDetails._id } },
      { new: true }
    );

    // Return new Function Hall and success response
    return res.status(201).json({
      success: true,
      message: "Function Hall Created Successfully",
      data: newVenueDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create a new Function Hall",
      error: error.message,
    });
  }
};

// Get all details of a single venue with detailed information instead of ObjectIds
exports.getSingleVenueDetails = async (req, res) => {
  try {
    // Validate and extract the venueId = require(the request parameters
    const { venueId } = req.body;
    if (!venueId) {
      return res.status(400).json({
        success: false,
        message: "venueId must be provided in the request body",
      });
    }

    // Fetch details of the published Venue
    const venueDetails = await Venue.findById(venueId)
      .where("status")
      .equals("Published")
      .populate("food")
      .populate("alcohol")
      .populate("decoration")
      .populate("otherPolicies")
      .populate("bookingDates")
      .populate({ path: "address", populate: { path: "GPS" } })
      .exec();

    // Validation: Check if the venueDetails was found
    if (!venueDetails) {
      return res.status(404).json({
        success: false,
        message: `Venue with venueId ${venueId} not found`,
      });
    }

    // Return the response with function hall details and total duration
    return res.status(200).json({
      success: true,
      message: "Venue details fetched successfully",
      data: venueDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching a single Venue details",
      error: error.message,
    });
  }
};

// Edit a single venue details
exports.editVenue = async (req, res) => {
  try {
    // Validate and extract the venueId = require(the request body
    const { venueId } = req.body;
    if (!venueId) {
      return res.status(400).json({
        success: false,
        message: "venueId must be provided in the request body",
      });
    }

    // Find the function hall by its venueId
    const existingVenue = await Venue.findById(venueId);
    if (!existingVenue) {
      return res.status(404).json({
        success: false,
        message: `Venue with venueId ${venueId} not found`,
      });
    }

    // Extract all possible fields = require(the Venue schema
    const venueFields = Object.keys(existingVenue._doc);
    // Iterate through the Venue fields and update if non-null values are present in req.body
    venueFields.forEach(async (field) => {
      if (
        req.body[field] !== undefined &&
        req.body[field] !== null &&
        field !== "images" &&
        field !== "video"
      ) {
        existingVenue[field] = req.body[field];
      }
      if (field === "video" && req.files && req.files[field]) {
        public_ids = [existingVenue[field].publicId];
        const uploadedFilesDetails = await uploadFilesToCloudinary(
          req.files[field],
          process.env.FOLDER_NAME,
          public_ids
        );
        existingVenue.video.url = uploadedFilesDetails.secure_url;
        existingVenue.video.publicId = uploadedFilesDetails.public_id;
        existingVenue.video.duration = uploadedFilesDetails.duration;
      }

      if (field === "images") {
        public_ids = existingVenue[field].map((image) => image.publicId);
        const uploadedFilesDetails = await uploadFilesToCloudinary(
          req.files[field],
          process.env.FOLDER_NAME,
          public_ids
        );
        existingVenue.images = uploadedFilesDetails.map((imgRes) => {
          return { url: imgRes.secure_url, publicId: imgRes.public_id };
        });
      }
    });

    // Save the updated Venue document
    const updatedVenue = await existingVenue.save();

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
      // Access the Address subdocument within the Venue
      const newSubSchema = existingVenue[subSchemaId];
      // Extract all possible fields = require(the Address sub-schema
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

    // Return the response with the updated existingVenue details
    return res.status(200).json({
      success: true,
      message: "Venue Details Updated Successfully",
      data: updatedVenue,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the existingVenue",
      error: error.message,
    });
  }
};

// Fetch available halls on specified dates, months & years
exports.allAvailableVenues = async (req, res) => {
  try {
    // Validate and extract the inputs = require(the request body
    const { checkInUnixTimestamp, checkOutUnixTimestamp } = req.body;

    const venues = await Venue.aggregate([
      // Stage 1: Lookup BookingInfo documents based on allBookings field
      {
        $lookup: {
          from: "BookingInfo",
          localField: "allBookings",
          foreignField: "_id",
          as: "bookings",
        },
      },
      // Stage 2: Unwind the bookings array for individual booking details
      {
        $unwind: "$bookings",
      },
      // Stage 3: Lookup BookingSlot documents for each booking
      {
        $lookup: {
          from: "BookingSlot",
          localField: "bookings.bookingSlot",
          foreignField: "_id",
          as: "bookingSlots",
        },
      },
      // Stage 4: Filter Venues based on booking slot availability
      {
        $match: {
          $or: [
            { "bookingSlots.checkInTime": { $gte: checkOutUnixTimestamp } },
            { "bookingSlots.checkOutTime": { $lte: checkInUnixTimestamp } },
          ],
        },
      },
      // Stage 5: Lookup Venue documents again
      {
        $lookup: {
          from: "Venue",
          localField: "_id",
          foreignField: "_id",
          as: "venueDetails",
        },
      },
      // Stage 6: Unwind the result = require(the Venue collection
      {
        $unwind: "$venueDetails",
      },
      // Stage 7: Filter Venues by status "Published"
      {
        $match: {
          "venueDetails.status": "Published",
        },
      },
      // Stage 8: Project the desired fields for the final result
      {
        $project: {
          _id: 1,
          name: "$venueDetails.name",
          aboutVenue: "$venueDetails.aboutVenue",
          manager: "$venueDetails.manager",
          images: "$venueDetails.images",
          pricePerDay: "$venueDetails.pricePerDay",
          guestCapacity: "$venueDetails.guestCapacity",
          parkingSpace: "$venueDetails.parkingSpace",
          lodgingRooms: "$venueDetails.lodgingRooms",
          video: "$venueDetails.video",
        },
      },
    ]);

    // Return a success response
    return res.status(200).json({
      success: true,
      message: "FUnction Halls open for booking fetched successfully",
      data: venues,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching the available venues for booking",
      error: error.message,
    });
  }
};
