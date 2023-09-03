import mongoose from "mongoose";

const bookingInfoSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
      type: Date,
      required: true,
    },
    fullyPaidDate: {
      type: Date,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    nextPaymentDueDate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookingDateTime",
      required: true,
    },
    checkInDateTime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookingDateTime",
      required: true,
    },
    checkOutDateTime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookingDateTime",
      required: true,
    },
    bookingStatus: {
      type: String,
      required: true,
      enum: ["Cancelled", "AdvancePaid", "Booked"],
    },
    paymentSummary: String,
  },
  {
    timestamps: true,
    strictPopulate: false,
  }
);

const BookingInfo = mongoose.model("FunctionHall", bookingInfoSchema);

export default BookingInfo;
