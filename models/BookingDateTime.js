import mongoose from "mongoose";

const bookingDateTimeSchema = new mongoose.Schema({
  checkInTime: {
    hours: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    ampm: {
      type: String,
      required: true,
      enum: ["AM", "PM"],
    },
  },
  checkOutTime: {
    hours: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    ampm: {
      type: String,
      required: true,
      enum: ["AM", "PM"],
    },
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
});

const BookingDateTime = mongoose.model(
  "BookingDateTime",
  bookingDateTimeSchema
);

export default BookingDateTime;
