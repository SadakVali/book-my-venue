const mongoose = require("mongoose");
const { BOOKING_STATUS } = require("../utils/constants");

const bookingInfoSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerContactNumber: {
    type: Number,
    required: true,
    // unique: true,
  },
  venueName: {
    type: String,
    required: true,
  },
  venueAddress: {
    type: String,
    required: true,
  },
  managerContactNumber: {
    type: Number,
    required: true,
    // unique: true,
  },
  advancePaid: {
    type: Number,
    required: true,
  },
  advancePaidOn: {
    type: Number,
    required: true,
  },
  fullyPaidDate: {
    type: Number,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  nextPaymentDueDate: {
    type: Number,
    required: true,
  },
  checkInTime: {
    type: Number,
    required: true,
  },
  checkOutTime: {
    type: Number,
    required: true,
  },
  bookingStatus: {
    type: String,
    required: true,
    enum: [
      BOOKING_STATUS.CANCELLED,
      BOOKING_STATUS.OCCATION_OVER,
      BOOKING_STATUS.BOOKED,
      BOOKING_STATUS.ADVANCE_PAID,
    ],
  },
  paymentSummary: String,
});

const BookingInfo = mongoose.model("BookingInfo", bookingInfoSchema);

module.exports = BookingInfo;
