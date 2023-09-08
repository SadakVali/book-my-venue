const schedule = require("node-schedule");
const mongoose = require("mongoose");
const BookingInfo = require("../models/BookingInfo"); // Import your BookingInfo model

// Define the scheduling logic in a function
function scheduleBookingStatusUpdate() {
  // Schedule a job to run every night at 12 AM
  schedule.scheduleJob("0 0 * * *", async () => {
    const currentTime = Math.floor(Date.now() / 1000); // Get the current Unix timestamp in seconds

    // Find BookingInfo documents that need updating
    const bookingsToBeUpdated = await BookingInfo.find({
      bookingStatus: { $in: ["Cancelled", "Booked", "AdvancePaid"] }, // Specify the statuses you want to update
    }).populate("bookingSlot"); // Use populate to retrieve associated BookingSlot data

    // Update the bookingStatus for each document where checkOutTime is in the past
    bookingsToBeUpdated.forEach(async (booking) => {
      if (
        booking.bookingSlot &&
        booking.bookingSlot.checkOutTime <= currentTime
      ) {
        booking.bookingStatus = "OccationOver"; // Set the new status
        await booking.save(); // Save the updated document
        // console.log(`Updated BookingInfo: ${booking._id}`);
      }
    });
  });
}

module.exports = scheduleBookingStatusUpdate;
