const mongoose = require("mongoose");

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

module.exports = BookingSlot;
