// Importing the models
const BookingInfo = require("../models/BookingInfo");
const User = require("../models/User");
const Venue = require("../models/Venue");

// const constants
const { BOOKING_STATUS } = require("../utils/constants");

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

// get All Advance Paid Bookings
// (current UnixTimeStamp < nextPaymentDueDate and bookingStatus === "AdvancePaid")
exports.fetchAdvancePaidBookings = async (req, res) => {
  try {
    const advancePaidBookings = await BookingInfo.find({
      nextPaymentDueDate: { $gt: Math.floor(Date.now() / 1000) },
      bookingStatus: BOOKING_STATUS.ADVANCE_PAID,
    }) // Sort by 'checkInTime' in descending order.
      .sort({ nextPaymentDueDate: -1 })
      .exec();

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
    ) // Sort by 'checkInTime' in descending order.
      .sort({ checkInTime: -1 })
      .exec();
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

// change status to booked
exports.changeStatusToBooked = async (req, res) => {
  try {
    // Validate and extract the inputs
    const { bookingId } = req.body;
    const updatedReciept = await BookingInfo.findByIdAndUpdate(
      bookingId,
      {
        bookingStatus: BOOKING_STATUS.BOOKED,
        fullyPaidDate: Math.floor(Date.now() / 1000),
      },
      { new: true }
    );
    if (!updatedReciept)
      return res.status(404).json({
        success: false,
        message: "Incorrect bookingId",
      });
    console.log(updatedReciept);

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

// get All Completely Paid booking reciepts (bookingStatus === "Booked")
exports.fetchAllBookedReciepts = async (req, res) => {
  try {
    // Sort it by occation date in descending order
    const allCompletelyBookedReciepts = await BookingInfo.find({
      bookingStatus: BOOKING_STATUS.BOOKED,
    }) // Sort by 'checkInTime' in Ascending order.
      .sort({ checkInTime: 1 })
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

// get All Payment Due today Bookings
// (current UnixTimeStamp >= nextPaymentDueDate and bookingStatus === "AdvancePaid")
exports.fetchPaymentsDueTodayBookings = async (req, res) => {
  try {
    console.log("Entered the controller correctly");
    const paymentDueReciepts = await BookingInfo.find({
      // nextPaymentDueDate: { $lte: 1701424001 },
      nextPaymentDueDate: { $lte: Math.floor(Date.now() / 1000) },
      bookingStatus: BOOKING_STATUS.ADVANCE_PAID,
    }) // Sort by 'nextPaymentDueDate' in Ascending order.
      .sort({ nextPaymentDueDate: 1 })
      .exec();

    console.log(paymentDueReciepts);

    if (paymentDueReciepts.length === 0)
      return res.status(203).json({
        success: false,
        message: "No Booking needs to be reminded for payment",
        data: paymentDueReciepts,
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
