const schedule = require("node-schedule");
const mongoose = require("mongoose");
const BookingInfo = require("../models/BookingInfo");

// Define the scheduling logic in a function
function scheduleBookingStatusUpdate() {
  // Schedule a job to run every night at 12 AM
  schedule.scheduleJob("0 0 * * *", async () => {
    // Get the current Unix timestamp in seconds
    const currentTime = Math.floor(Date.now() / 1000);
    // Find BookingInfo documents that need updating
    const bookingsToBeUpdated = await BookingInfo.find({
      // Specify the statuses you want to update
      bookingStatus: { $in: ["Booked", "AdvancePaid"] },
    });
    // Update the bookingStatus for each document where checkOutTime is in the past
    bookingsToBeUpdated.forEach(async (booking) => {
      if (booking.checkOutTime <= currentTime) {
        booking.bookingStatus = "OccasionOver"; // Set the new status
        await booking.save(); // Save the updated document
        // console.log(`Updated BookingInfo: ${booking._id}`);
      }
    });
  });
}

module.exports = scheduleBookingStatusUpdate;
