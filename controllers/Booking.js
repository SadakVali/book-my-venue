// Importing the models
const User = require("../models/User");
const BookingInfo = require("../models/BookingInfo");
const Venue = require("../models/FunctionHall");

// const constants
const { BOOKING_STATUS } = require("../utils/constants");
const { ACCOUNT_TYPE } = require("../utils/constants");

// create a new booking
exports.createNewBooking = async (req, res) => {
  try {
    // Validate and extract the inputs = require(the request body
    const {
      checkInTime,
      checkOutTime,
      name,
      contactNumber,
      alternateContactNumber,
      venueId,
      advancePaid,
      advancePaidOn,
      totalAmount,
      nextPaymentDueDate,
      paymentSummary,
    } = req.body;
    const bookingStatus = BOOKING_STATUS.DRAFT;
    if (!venueId) {
      return res.status(400).json({
        success: false,
        message: "venueId must be provided in the request body",
      });
    }

    let customerDetails = await User.find({ contactNumber });
    customerDetails = await User.create({
      name,
      contactNumber,
      alternateContactNumber,
      role: ACCOUNT_TYPE.CUSTOMER,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${name} ${name}`,
    });
    const newBookingSlot = await BookingSlot.create({
      checkInTime,
      checkOutTime,
    });
    const newBookingDetails = await BookingInfo.create({
      customer: customerDetails._id,
      manager: venueId,
      advancePaid,
      advancePaidOn,
      totalAmount,
      nextPaymentDueDate,
      bookingSLot: newBookingSlot._id,
      bookingStatus,
      paymentSummary,
    });
    // updating the allBookings field of the venue
    await Venue.findByIdAndUpdate(
      venueId,
      { $push: { allBookings: newBookingDetails._id } },
      { new: true }
    );
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

// Fetch details of all Bookings of a single customer
exports.fetchReciepts = async (req, res) => {
  try {
    // Validate and extract the inputs = require(the request body
    const { customerContactNumber } = req.body;

    const customerBookingReciepts = await BookingInfo.find({
      customerContactNumber,
    });

    if (!customerBookingReciepts)
      return res.status(400).json({
        success: false,
        message: "Invalid customerContactNumber given",
      });

    // Return a success response
    return res.status(200).json({
      success: true,
      message: "All Reciepts fetched successfully",
      data: customerBookingReciepts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching the reciepts of the customer",
      error: error.message,
    });
  }
};

// All Payment Due today Bookings (current UnixTimeStamp >= nextPaymentDueDate and bookingStatus === "AdvancePaid")
exports.fetchPaymentsDueTodayBookings = async (req, res) => {
  try {
    const paymentDueReciepts = await BookingInfo.find({
      nextPaymentDueDate: { $lt: Math.floor(Date.now() / 1000) },
    });

    if (paymentDueReciepts.length === 0)
      return res.status(400).json({
        success: false,
        message: "Invalid customerContactNumber given",
      });

    // Return a success response
    return res.status(200).json({
      success: true,
      message: "All Payments Reciepts that are Due today fetched successfully",
      data: paymentDueReciepts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the Payment Due Reciepts",
      error: error.message,
    });
  }
};

// All Cancelled Bookings (bookingStatus === "Cancelled")
exports.fetchAllCancelledBookings = async (req, res) => {
  try {
    // TODO: Sort it by occation date in descending order
    const allCancelledBookings = await BookingInfo.find({
      bookingStatus: {
        $elemMatch: { $eq: BOOKING_STATUS.CANCELLED },
      },
    });
    // Return a success response
    return res.status(200).json({
      success: true,
      message: "All Cancelled Reciepts fetched successfully",
      data: allCancelledBookings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the Cancelled reciepts",
      error: error.message,
    });
  }
};

// All Advance Paid Bookings (current UnixTimeStamp < nextPaymentDueDate and bookingStatus === "AdvancePaid")
exports.fetchAdvancePaidBookingsNotDueToday = async (req, res) => {
  try {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const advancePaidBookings = await BookingInfo.find({
      nextPaymentDueDate: { $lt: currentTimeInSeconds },
      bookingStatus: BOOKING_STATUS.ADVANCE_PAID,
    });

    if (advancePaidBookings.length === 0)
      return res.status(400).json({
        success: false,
        message: "Invalid customerContactNumber given",
      });

    // Return a success response
    return res.status(200).json({
      success: true,
      message:
        "All Advance Paid Bookings But Not Due Today Reciepts fetched successfully",
      data: advancePaidBookings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching All Advance Paid Bookings But Not Due Today Reciepts",
      error: error.message,
    });
  }
};

// All Completely Paid Bookings (bookingStatus === "Booked")
exports.fetchAllBookedReciepts = async (req, res) => {
  try {
    // TODO: Sort it by occation date in descending order
    const allCompletelyBookedReciepts = await BookingInfo.find({
      bookingStatus: {
        $elemMatch: { $eq: BOOKING_STATUS.BOOKED },
      },
    });
    // Return a success response
    return res.status(200).json({
      success: true,
      message: "All Completely Paid Reciepts fetched successfully",
      data: allCompletelyBookedReciepts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching all Completely Paid Reciepts",
      error: error.message,
    });
  }
};

// All Occation Over (bookingStatus === "OccationOver")
exports.fetchAllBookingsPastOccation = async (req, res) => {
  try {
    // TODO: Sort it by occation date in descending order
    const allOccationCompltedBookings = await BookingInfo.find({
      bookingStatus: {
        $elemMatch: { $eq: BOOKING_STATUS.OCCATION_OVER },
      },
    });
    // Return a success response
    return res.status(200).json({
      success: true,
      message:
        "All Bookings Reciepts whose Occation has been selebrated in your Venue fetched successfully",
      data: allOccationCompltedBookings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching All Completed Bookings Reciepts",
      error: error.message,
    });
  }
};

// cancel booking
exports.cancelSingleBooking = async (req, res) => {
  try {
    // Validate and extract the inputs = require(the request body
    const { bookingId } = req.body;
    const cancelledBooking = await BookingInfo.findByIdAndUpdate(
      bookingId,
      {
        bookingStatus: BOOKING_STATUS.CANCELLED,
      },
      { new: true }
    );

    // Return a success response
    return res.status(200).json({
      success: true,
      message: "Booking has been Cancelled successfully",
      data: cancelledBooking,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while Cancelling a Booking",
      error: error.message,
    });
  }
};

// change status to booked
exports.changeStatusToBooked = async (req, res) => {
  try {
    // Validate and extract the inputs = require(the request body
    const { bookingId } = req.body;
    const compltelyBookedReciept = await BookingInfo.findByIdAndUpdate(
      bookingId,
      {
        bookingStatus: BOOKING_STATUS.BOOKED,
      },
      { new: true }
    );

    // Return a success response
    return res.status(200).json({
      success: true,
      message: "Status of the Booking has been Changed to Booked sccessfully",
      data: compltelyBookedReciept,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while Changing the status to Booked",
      error: error.message,
    });
  }
};

// Fetch Booking History of a single Venue of specified month & Year
exports.bookingHistoryOfSingleVenue = async (req, res) => {
  try {
    // Validate and extract the inputs = require(the request body
    const { managerId, startingUnixTimeStamp, endingUnixTimeStamp } = req.body;

    const venue = await Venue.findById(managerId);
    let venueBookingHistoryDetails;
    if (venue) {
      venueBookingHistoryDetails = await venue.allBookings.aggregate([
        { $unwind: "$allBookings" },
        {
          $match: {
            "allBookings.checkInTime": { $lt: endingUnixTimeStamp },
            "allBookings.checkOutTime": { $gt: startingUnixTimeStamp },
          },
        },
      ]);
    }

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
