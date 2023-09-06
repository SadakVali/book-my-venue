import mongoose from "mongoose";

const bookingInfoSchema = new mongoose.Schema(
  {
    customerName: {
      type: Number,
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
    functionHall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FunctionHall",
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
    bookingSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookingSlot",
      required: true,
    },
    bookingStatus: {
      type: String,
      required: true,
      enum: ["Cancelled", "AdvancePaid", "Booked", "OccationOver"],
    },
    paymentSummary: String,
  },
  {
    timestamps: true,
    strictPopulate: false,
  }
);

const BookingInfo = mongoose.model("BookingInfo", bookingInfoSchema);

export default BookingInfo;
