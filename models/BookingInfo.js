const mongoose = require("mongoose");

const bookingInfoSchema = new mongoose.Schema(
  {
    customerName: {
      type: Number,
      required: true,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerContactNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    customerAlternateContactNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
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
      enum: ["Cancelled", "AdvancePaid", "Booked", "OccasionOver"],
    },
    paymentSummary: String,
  },
  {
    timestamps: true,
    strictPopulate: false,
  }
);

const BookingInfo = mongoose.model("BookingInfo", bookingInfoSchema);

module.exports = BookingInfo;
