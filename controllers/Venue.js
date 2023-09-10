// Importing the utility snippets
const { uploadFilesToCloudinary } = require("../utils/uploadFileToCloudinary");

// Importing the models
const User = require("../models/User");
const Venue = require("../models/Venue");
const Address = require("../models/Address");

// const constants
const { VENUE_STATUS } = require("../utils/constants");
const { ACCOUNT_TYPE } = require("../utils/constants");

// Create a new venue handler function
exports.createVenue = async (req, res) => {
  try {
    // Destructure data = require(the request body
    const {
      name,
      aboutVenue,
      venuePricePerDay,
      advancePercentage,
      guestCapacity,
      carParkingSpace,
      numOfLodgingRooms,
      lodgingRoomPrice,
      isBookingCancellable,
      // Food
      isCateringProvidedByVenue,
      isOutsideCatererAllowed,
      isNonVegAllowedAtVenue,
      vegPricePerPlate,
      NonvegPricePerPlate,
      // Alcohol
      isAlcoholProvidedByVenue,
      isOutsideAlcoholAllowed,
      // Decor
      isDecorProvidedByVenue,
      isOutsideDecoratersAllowed,
      // OtherPolicies
      isMusicAllowedLateAtNight,
      isHallAirConditioned,
      isBaaratAllowed,
      areFireCrackersAllowed,
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

    // console.log({
    //   name,
    //   aboutVenue,
    //   venuePricePerDay,
    //   advancePercentage,
    //   guestCapacity,
    //   carParkingSpace,
    //   numOfLodgingRooms,
    //   lodgingRoomPrice,
    //   isBookingCancellable,
    //   // Food
    //   isCateringProvidedByVenue,
    //   isOutsideCatererAllowed,
    //   isNonVegAllowedAtVenue,
    //   vegPricePerPlate,
    //   NonvegPricePerPlate,
    //   // Alcohol
    //   isAlcoholProvidedByVenue,
    //   isOutsideAlcoholAllowed,
    //   // Decor
    //   isDecorProvidedByVenue,
    //   isOutsideDecoratersAllowed,
    //   // OtherPolicies
    //   isMusicAllowedLateAtNight,
    //   isHallAirConditioned,
    //   isBaaratAllowed,
    //   areFireCrackersAllowed,
    //   isHawanAllowed,
    //   isOverNightWeddingAllowed,
    //   // Address
    //   street,
    //   landmark,
    //   distanceFromLandmark,
    //   village,
    //   city,
    //   pin,
    //   // GPS
    //   coordinates: JSON.parse(coordinates),
    // });
    // console.log(req?.files?.images);
    // console.log(req?.files?.videos);

    // Validate required fields
    if (
      !req?.files?.images || // Use optional chaining for safer thumbnailImage access
      !req?.files?.videos ||
      !name ||
      !aboutVenue ||
      !venuePricePerDay ||
      !advancePercentage ||
      !guestCapacity ||
      !carParkingSpace ||
      !numOfLodgingRooms ||
      !lodgingRoomPrice ||
      !isBookingCancellable ||
      // Food
      !isCateringProvidedByVenue ||
      !isOutsideCatererAllowed ||
      !isNonVegAllowedAtVenue ||
      !vegPricePerPlate ||
      !NonvegPricePerPlate ||
      // Alcohol
      !isAlcoholProvidedByVenue ||
      !isOutsideAlcoholAllowed ||
      // Decor
      !isDecorProvidedByVenue ||
      !isOutsideDecoratersAllowed ||
      // OtherPolicies
      !isMusicAllowedLateAtNight ||
      !isHallAirConditioned ||
      !isBaaratAllowed ||
      !areFireCrackersAllowed ||
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
      !JSON.parse(coordinates).length
    )
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });

    // Check if the user is a manager
    const managerDetails = await User.findById(req.user.id);
    // console.log("Manager Details", managerDetails);
    if (!managerDetails || managerDetails.role !== ACCOUNT_TYPE.MANAGER)
      return res.status(404).json({
        success: false,
        message: "Manager details not found",
      });

    // make sure there is no function hall registered with the given managerId earlier
    if (managerDetails.venue)
      return res.status(401).json({
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
      // console.log("Uploaded Images Details", imagesResponse);
    }

    // Upload videos to Cloudinary
    let videoResponse;
    if (req?.files?.videos) {
      videoResponse = await uploadFilesToCloudinary(
        req?.files?.videos,
        process.env.FOLDER_NAME
      );
      // console.log("Uploaded Video Details", videoResponse);
    }

    // Create a new Food entry
    const newFoodEntry = {
      isCateringProvidedByVenue,
      isOutsideCatererAllowed,
      isNonVegAllowedAtVenue,
      vegPricePerPlate,
      NonvegPricePerPlate,
    };

    // Create a new Alcohol entry
    const newAlcoholEntry = {
      isAlcoholProvidedByVenue,
      isOutsideAlcoholAllowed,
    };

    // Create a new Decor entry
    const newDecorEntry = {
      isDecorProvidedByVenue,
      isOutsideDecoratersAllowed,
    };

    // Create a new OtherPolicies entry
    const newOtherPoliciesEntry = {
      isMusicAllowedLateAtNight,
      isHallAirConditioned,
      isBaaratAllowed,
      areFireCrackersAllowed,
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
      venuePricePerDay,
      manager: req.user.id,
      advancePercentage,
      images: zipImageArrays(imagesResponse),
      videos: zipVideoArrays(videoResponse),
      guestCapacity,
      carParkingSpace,
      numOfLodgingRooms,
      lodgingRoomPrice,
      isBookingCancellable,
      food: newFoodEntry,
      alcohol: newAlcoholEntry,
      decoration: newDecorEntry,
      otherPolicies: newOtherPoliciesEntry,
      address: newAddressEntry._id,
      status: VENUE_STATUS.DRAFT,
    });

    // Add the new function hall to the user doc of Instructor
    console.log(newVenueDetails._id);
    const result = await User.findByIdAndUpdate(
      req.user.id,
      { venue: newVenueDetails._id },
      { new: true }
    );
    console.log("RESULT ", result);

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
      .populate("address")
      .populate("manager")
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
    // Destructure data = require(the request body
    const {
      name,
      aboutVenue,
      venuePricePerDay,
      advancePercentage,
      guestCapacity,
      carParkingSpace,
      numOfLodgingRooms,
      lodgingRoomPrice,
      isBookingCancellable,
      // Food
      isCateringProvidedByVenue,
      isOutsideCatererAllowed,
      isNonVegAllowedAtVenue,
      vegPricePerPlate,
      NonvegPricePerPlate,
      // Alcohol
      isAlcoholProvidedByVenue,
      isOutsideAlcoholAllowed,
      // Decor
      isDecorProvidedByVenue,
      isOutsideDecoratersAllowed,
      // OtherPolicies
      isMusicAllowedLateAtNight,
      isHallAirConditioned,
      isBaaratAllowed,
      areFireCrackersAllowed,
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
      venueId,
    } = req.body;

    // Find the function hall by its venueId
    const existingVenue = await Venue.findById(venueId)
      .where("status")
      .equals("Published")
      .populate("address")
      .populate("manager")
      .exec();

    // Upload images to Cloudinary
    let imagesResponse;
    if (req?.files?.images) {
      imagesResponse = await uploadFilesToCloudinary(
        (files = req?.files?.images),
        (folder = process.env.FOLDER_NAME),
        (publicIds = existingVenue.images.map((image) => image.publicId))
      );
      console.log("Uploaded Images Details", imagesResponse);
    }

    // Upload videos to Cloudinary
    let videoResponse;
    if (req?.files?.videos) {
      videoResponse = await uploadFilesToCloudinary(
        (files = req?.files?.videos),
        (folder = process.env.FOLDER_NAME),
        (publicIds = existingVenue.videos.map((vid) => vid.publicId))
      );
      console.log("Uploaded Video Details", videoResponse);
    }

    // Update the main venue fields if they are defined
    if (
      !name ||
      !aboutVenue ||
      !venuePricePerDay ||
      !advancePercentage ||
      !guestCapacity ||
      !carParkingSpace ||
      !numOfLodgingRooms ||
      !lodgingRoomPrice ||
      !isBookingCancellable ||
      // Food
      !isCateringProvidedByVenue ||
      !isOutsideCatererAllowed ||
      !isNonVegAllowedAtVenue ||
      !vegPricePerPlate ||
      !NonvegPricePerPlate ||
      // Alcohol
      !isAlcoholProvidedByVenue ||
      !isOutsideAlcoholAllowed ||
      // Decor
      !isDecorProvidedByVenue ||
      !isOutsideDecoratersAllowed ||
      // OtherPolicies
      !isMusicAllowedLateAtNight ||
      !isHallAirConditioned ||
      !isBaaratAllowed ||
      !areFireCrackersAllowed ||
      !isHawanAllowed ||
      !isOverNightWeddingAllowed
    ) {
      if (name !== undefined) existingVenue.name = name;
      if (aboutVenue !== undefined) existingVenue.aboutVenue = aboutVenue;
      if (venuePricePerDay !== undefined)
        existingVenue.venuePricePerDay = venuePricePerDay;
      if (advancePercentage !== undefined)
        existingVenue.advancePercentage = advancePercentage;
      if (guestCapacity !== undefined)
        existingVenue.guestCapacity = guestCapacity;
      if (carParkingSpace !== undefined)
        existingVenue.carParkingSpace = carParkingSpace;
      if (numOfLodgingRooms !== undefined)
        existingVenue.numOfLodgingRooms = numOfLodgingRooms;
      if (lodgingRoomPrice !== undefined)
        existingVenue.lodgingRoomPrice = lodgingRoomPrice;
      if (isBookingCancellable !== undefined)
        existingVenue.isBookingCancellable = isBookingCancellable;

      // Create a new Food entry
      if (isCateringProvidedByVenue !== undefined)
        existingVenue.isCateringProvidedByVenue = isCateringProvidedByVenue;
      if (isOutsideCatererAllowed !== undefined)
        existingVenue.isOutsideCatererAllowed = isOutsideCatererAllowed;
      if (isNonVegAllowedAtVenue !== undefined)
        existingVenue.isNonVegAllowedAtVenue = isNonVegAllowedAtVenue;
      if (vegPricePerPlate !== undefined)
        existingVenue.vegPricePerPlate = vegPricePerPlate;
      if (NonvegPricePerPlate !== undefined)
        existingVenue.NonvegPricePerPlate = NonvegPricePerPlate;

      // Create a new Alcohol entry
      if (isAlcoholProvidedByVenue !== undefined)
        existingVenue.isAlcoholProvidedByVenue = isAlcoholProvidedByVenue;
      if (isOutsideAlcoholAllowed !== undefined)
        existingVenue.isOutsideAlcoholAllowed = isOutsideAlcoholAllowed;

      // Create a new Decor entry
      if (isDecorProvidedByVenue !== undefined)
        existingVenue.isDecorProvidedByVenue = isDecorProvidedByVenue;
      if (isOutsideDecoratersAllowed !== undefined)
        existingVenue.isOutsideDecoratersAllowed = isOutsideDecoratersAllowed;

      // Create a new OtherPolicies entry
      if (isMusicAllowedLateAtNight !== undefined)
        existingVenue.isMusicAllowedLateAtNight = isMusicAllowedLateAtNight;
      if (isHallAirConditioned !== undefined)
        existingVenue.isHallAirConditioned = isHallAirConditioned;
      if (isBaaratAllowed !== undefined)
        existingVenue.isBaaratAllowed = isBaaratAllowed;
      if (areFireCrackersAllowed !== undefined)
        existingVenue.areFireCrackersAllowed = areFireCrackersAllowed;
      if (isHawanAllowed !== undefined)
        existingVenue.isHawanAllowed = isHawanAllowed;
      if (isOverNightWeddingAllowed !== undefined)
        existingVenue.isOverNightWeddingAllowed = isOverNightWeddingAllowed;
      await existingVenue.save();
    }

    // Update address if they are defined
    if (
      !street ||
      !landmark ||
      !distanceFromLandmark ||
      !village ||
      !city ||
      !pin ||
      !coordinates
    ) {
      if (street !== undefined) existingVenue.address.street = street;
      if (landmark !== undefined) existingVenue.address.landmark = landmark;
      if (distanceFromLandmark !== undefined)
        existingVenue.address.distanceFromLandmark = distanceFromLandmark;
      if (village !== undefined) existingVenue.address.village = village;
      if (city !== undefined) existingVenue.address.city = city;
      if (pin !== undefined) existingVenue.address.pin = pin;
      if (coordinates !== undefined)
        existingVenue.address.location = {
          type: "Point",
          coordinates: JSON.parse(coordinates),
        };
      await existingVenue.address.save();
    }

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

// Fetch available halls on specified dates, months & years
exports.allAvailableVenues = async (req, res) => {
  try {
    // Validate and extract the inputs = require(the request body
    const { checkInUnixTimestamp, checkOutUnixTimestamp } = req.body;

    // Find FunctionHalls that don't have conflicts
    const availableFunctionHalls = await Venue.find({
      $or: [
        // Check-out before new booking's check-in
        { "allBookings.checkOutTime": { $lt: checkInUnixTimestamp } },
        // Check-in after new booking's check-out
        { "allBookings.checkInTime": { $gt: checkOutUnixTimestamp } },
      ],
    });

    // Return a success response
    return res.status(200).json({
      success: true,
      message: "Function Halls open for booking fetched successfully",
      data: availableFunctionHalls,
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
