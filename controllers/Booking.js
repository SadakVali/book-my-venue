// Importing the models
import User from "../models/User";
import BookingSlot from "../models/BookingSlot";
import BookingInfo from "../models/BookingInfo";
import FunctionHall from "../models/FunctionHall";

// import constants
import { BOOKING_STATUS } from "../utils/constants";
import { ACCOUNT_TYPE } from "../utils/constants";

// create a new booking
exports.createNewBooking = async (req, res) => {
  try {
    // Validate and extract the inputs from the request body
    const {
      checkInTime,
      checkOutTime,
      name,
      contactNumber,
      alternateContactNumber,
      functionHallId,
      advancePaid,
      advancePaidOn,
      totalAmount,
      nextPaymentDueDate,
      paymentSummary,
    } = req.body;
    const bookingStatus = BOOKING_STATUS.DRAFT;
    if (!functionHallId) {
      return res.status(400).json({
        success: false,
        message: "functionHallId must be provided in the request body",
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
      manager: functionHallId,
      advancePaid,
      advancePaidOn,
      totalAmount,
      nextPaymentDueDate,
      bookingSLot: newBookingSlot._id,
      bookingStatus,
      paymentSummary,
    });
    // updating the allBookings field of the function hall
    await FunctionHall.findByIdAndUpdate(
      functionHallId,
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
      message: "Something went wrong while creating a Function Hall booking",
      error: error.message,
    });
  }
};

// Fetch details of all Bookings of a single customer
// All Payment Due today Bookings (current UnixTimeStamp >= nextPaymentDueDate and bookingStatus === "AdvancePaid")
// All Cancelled Bookings (bookingStatus === "Cancelled")
// All Advance Paid Bookings (current UnixTimeStamp < nextPaymentDueDate and bookingStatus === "AdvancePaid")
// All Completely Paid Bookings (bookingStatus === "Booked")
// All Occation Over (bookingStatus === "OccationOver")
// cancel booking
// change status to booked
// change status to Occation Over

// Fetch Booking History of a single Function Hall of specified month & Year
exports.bookingHistoryOfSingleFunctionHall = async (req, res) => {
  try {
    // Validate and extract the inputs from the request body
    const { managerId, startingUnixTimeStamp, endingUnixTimeStamp } = req.body;

    const functionHall = await FunctionHall.findById(managerId);
    let functionHallBookingHistoryDetails;
    if (functionHall) {
      functionHallBookingHistoryDetails =
        await functionHall.allBookings.aggregate([
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
      data: functionHallBookingHistoryDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching the booking history of a Function Hall",
      error: error.message,
    });
  }
};
