import mongoose from "mongoose";

const bookingSlotSchema = new mongoose.Schema({
  checkInTime: {
    type: Number,
    required: true,
  },
  checkOutTime: {
    type: Number,
    required: true,
  },
});

const BookingSlot = mongoose.model("BookingSlot", bookingSlotSchema);

export default BookingSlot;
