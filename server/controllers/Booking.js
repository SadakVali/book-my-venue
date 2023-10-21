// Importing the models
const BookingInfo = require("../models/BookingInfo");
const User = require("../models/User");
const Venue = require("../models/Venue");

// const constants
const { BOOKING_STATUS } = require("../utils/constants");

// create a new booking
exports.createNewBooking = async (req, res) => {
  try {
    // Validate and extract the inputs = require(the request body
    const {
      venueId,
      customerName,
      customerContactNumber,
      venueName,
      venueAddress,
      managerContactNumber,
      advancePaid,
      advancePaidOn,
      nextPaymentDueDate,
      checkInTime,
      checkOutTime,
      totalAmount,
    } = req.body;

    // Validate required fields
    if (
      !venueId ||
      !customerName ||
      !customerContactNumber ||
      !venueName ||
      !venueAddress ||
      !managerContactNumber ||
      !advancePaid ||
      !advancePaidOn ||
      !nextPaymentDueDate ||
      !checkInTime ||
      !checkOutTime ||
      !totalAmount
    )
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });

    // console.log("Entered the controller");

    const existingBookings = await BookingInfo.find({
      venueId,
      // return those existing bookings those satisfy bothe the conditions below
      $and: [
        {
          // This part checks if the existing booking's check-in time is less
          // than or equal to the new booking's check-out time.
          checkInTime: { $lte: checkOutTime },
          // This part checks if the existing booking's check-out time is greater
          // than or equal to the new booking's check-in time.
          checkOutTime: { $gte: checkInTime },
        },
      ],
    });

    // If there are existing bookings with a time conflict, return an error response
    if (existingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Booking time conflict with existing booking",
      });
    }

    const newBookingDetails = await BookingInfo.create({
      venueName,
      venueAddress,
      managerContactNumber,
      customerName,
      customerContactNumber,
      advancePaid,
      advancePaidOn,
      nextPaymentDueDate,
      checkInTime,
      checkOutTime,
      totalAmount,
      bookingStatus: BOOKING_STATUS.ADVANCE_PAID,
    });
    // console.log({ newBookingDetails });
    // updating the allBookings field of the venue
    const updatedVenue = await Venue.findByIdAndUpdate(venueId, {
      $push: { allBookings: newBookingDetails._id },
    }).exec();
    // console.log("DONE", updatedVenue);
    // let customer = await User.findOne({
    //   contactNumber: customerContactNumber,
    // });
    // if (!customer) {
    //   // create new customer document with booking info
    //   customer = await User.create({
    //     name: customerName,
    //     contactNumber: customerContactNumber,
    //     role: ACCOUNT_TYPE.CUSTOMER,
    //     image: `https://api.dicebear.com/5.x/initials/svg?seed=${customerName}}`,
    //     allBookings: [newBookingDetails._id],
    //   });
    // } else {
    //   // update the user document
    //   customer.allBookings.push(newBookingDetails._id);
    //   customer.save();
    // }
    // console.log(customer);
    // Return a success response
    return res.status(200).json({
      success: true,
      message: "a new booking created successfully",
      data: newBookingDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating a Venue booking",
      error: error.message,
    });
  }
};

// Fetch Booking History of a single Venue of specified month & Year
exports.bookingsOfVenueGivenMonth = async (req, res) => {
  try {
    // Validate and extract the inputs = require(the request body
    const { venueId, startingUnixTimeStamp, endingUnixTimeStamp } = req.body;
    // console.log(venueId);
    const venue = await Venue.findById(venueId).populate("allBookings").exec();
    // console.log(venue);
    if (!venue)
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });

    const venueBookingHistoryDetails = venue.allBookings.filter(
      (booking) =>
        booking.checkInTime < endingUnixTimeStamp &&
        booking.checkOutTime > startingUnixTimeStamp
    );

    console.log({ venue, venueBookingHistoryDetails });

    // Return a success response
    return res.status(200).json({
      success: true,
      message: "Booking History Filtered successfully",
      data: venueBookingHistoryDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching the booking history of a Venue",
      error: error.message,
    });
  }
};
