// Importing the models
const BookingInfo = require("../models/BookingInfo");
const Venue = require("../models/Venue");

// const constants
const { BOOKING_STATUS } = require("../utils/constants");

// get All Payment Due today Bookings
// (current UnixTimeStamp >= nextPaymentDueDate and bookingStatus === "AdvancePaid")
exports.fetchPaymentsDueTodayBookings = async (req, res) => {
  try {
    const paymentDueReciepts = await BookingInfo.find({
      nextPaymentDueDate: { $lte: Math.floor(Date.now() / 1000) },
      bookingStatus: BOOKING_STATUS.ADVANCE_PAID,
    });

    if (paymentDueReciepts.length === 0)
      return res.status(204).json({
        success: false,
        message: "No Booking needs to be reminded for payment",
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

// get All Advance Paid Bookings
// (current UnixTimeStamp < nextPaymentDueDate and bookingStatus === "AdvancePaid")
exports.fetchAdvancePaidBookings = async (req, res) => {
  try {
    const advancePaidBookings = await BookingInfo.find({
      nextPaymentDueDate: { $gt: Math.floor(Date.now() / 1000) },
      bookingStatus: BOOKING_STATUS.ADVANCE_PAID,
    });

    if (advancePaidBookings.length === 0)
      return res.status(204).json({
        success: false,
        message: "There are No Adavance Paid Bookings",
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

// UPDATE THE SUMMARY OF THE BOOKING RECIEPT
exports.updatePaymentSummary = async (req, res) => {
  try {
    const { bookingId, paymentSummary } = req.body;
    // Validate input
    if (!bookingId || !paymentSummary) {
      return res.status(400).json({
        success: false,
        message: "Both 'bookingId' and 'paymentSummary' are required fields.",
      });
    }

    const updatedBookingDetails = await BookingInfo.findByIdAndUpdate(
      bookingId,
      { paymentSummary: paymentSummary },
      { new: true }
    );

    if (!updatedBookingDetails) {
      return res.status(404).json({
        success: false,
        message: "Couldn't found the booking info with the given bookingId",
      });
    }

    // Return a success response
    return res.status(200).json({
      success: true,
      message: "Booking Summary is updated successfully",
      data: updatedBookingDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the summary of the booking",
      error: error.message,
    });
  }
};

// create a new booking
exports.createNewBooking = async (req, res) => {
  try {
    // Validate and extract the inputs = require(the request body
    const {
      venueId,
      customerName,
      customerContactNumber,
      customerAlternateContactNumber,
      venueName,
      venueAddress,
      managerContactNumber,
      managerAlternateContactNumber,
      advancePaid,
      advancePaidOn,
      fullyPaidDate,
      nextPaymentDueDate,
      checkInTime,
      checkOutTime,
      totalAmount,
      paymentSummary,
    } = req.body;

    const newBookingDetails = await BookingInfo.create({
      customerName,
      customerContactNumber,
      customerAlternateContactNumber,
      venueName,
      venueAddress,
      managerContactNumber,
      managerAlternateContactNumber,
      advancePaid,
      advancePaidOn,
      fullyPaidDate,
      nextPaymentDueDate,
      checkInTime,
      checkOutTime,
      totalAmount,
      paymentSummary,
      bookingStatus: BOOKING_STATUS.ADVANCE_PAID,
    });
    // updating the allBookings field of the venue
    await Venue.findByIdAndUpdate(venueId, {
      $push: { allBookings: newBookingDetails._id },
    });
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

// get all reciepts of a single customer
exports.fetchSingleCustomerReciepts = async (req, res) => {
  try {
    // Validate and extract the inputs
    const { customerContactNumber } = req.body;
    const customerBookingReciepts = await BookingInfo.find({
      customerContactNumber,
    });
    if (customerBookingReciepts.length === 0)
      return res.status(404).json({
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

// get All Cancelled Bookings (bookingStatus === "Cancelled")
exports.fetchAllCancelledBookings = async (req, res) => {
  try {
    // Sort it by occation date in descending order
    const allCancelledBookings = await BookingInfo.find({
      bookingStatus: BOOKING_STATUS.CANCELLED,
    }) // Sort by 'checkInTime' in descending order.
      .sort({ checkInTime: -1 })
      .exec();
    // Check if there are no matching bookings
    if (allCancelledBookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings with 'Booked' status found.",
      });
    }
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

// get All Completely Paid booking reciepts (bookingStatus === "Booked")
exports.fetchAllBookedReciepts = async (req, res) => {
  try {
    // Sort it by occation date in descending order
    const allCompletelyBookedReciepts = await BookingInfo.find({
      bookingStatus: BOOKING_STATUS.BOOKED,
    }) // Sort by 'checkInTime' in descending order.
      .sort({ checkInTime: -1 })
      .exec();
    // Check if there are no matching bookings
    if (allCompletelyBookedReciepts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings with 'Booked' status found.",
      });
    }
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

// get All Occation Over booking reciepts (bookingStatus === "OccasionOver")
exports.fetchAllBookingsPastOccation = async (req, res) => {
  try {
    // Sort it by occation date in descending order
    const allOccasionCompletedBookings = await BookingInfo.find({
      bookingStatus: BOOKING_STATUS.OCCATION_OVER,
    }) // Sort by 'checkInTime' in descending order.
      .sort({ checkInTime: -1 })
      .exec();
    // Check if there are no matching bookings
    if (allOccasionCompletedBookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings with 'OccasionOver' status found.",
      });
    }
    // Return a success response
    return res.status(200).json({
      success: true,
      message:
        "All Bookings Reciepts whose Occation has been selebrated in your Venue fetched successfully",
      data: allOccasionCompletedBookings,
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

// change status to cancel
exports.cancelSingleBooking = async (req, res) => {
  try {
    // Validate and extract the inputs
    const { bookingId } = req.body;
    const updatedBooking = await BookingInfo.findByIdAndUpdate(
      bookingId,
      {
        bookingStatus: BOOKING_STATUS.CANCELLED,
      },
      { new: true }
    );
    if (!updatedBooking)
      return res.status(404).json({
        success: false,
        message: "Incorrect bookingId",
      });

    // Return a success response
    return res.status(200).json({
      success: true,
      message: "Booking has been Cancelled successfully",
      data: updatedBooking,
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
    // Validate and extract the inputs
    const { bookingId } = req.body;
    const updatedReciept = await BookingInfo.findByIdAndUpdate(
      bookingId,
      {
        bookingStatus: BOOKING_STATUS.BOOKED,
      },
      { new: true }
    );
    if (!updatedBooking)
      return res.status(404).json({
        success: false,
        message: "Incorrect bookingId",
      });

    // Return a success response
    return res.status(200).json({
      success: true,
      message: "Status of the Booking has been Changed to Booked sccessfully",
      data: updatedReciept,
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

    const venue = await Venue.findOne({ managerId });
    if (!venue)
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });

    const venueBookingHistoryDetails = venue.allBookings.find({
      "allBookings.checkInTime": { $lt: endingUnixTimeStamp },
      "allBookings.checkOutTime": { $gt: startingUnixTimeStamp },
    });

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
