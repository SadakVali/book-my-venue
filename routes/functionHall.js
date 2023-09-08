// const modules
const express = require("express");

// const controllers
const {
  createNewBooking,
  fetchReciepts,
  fetchPaymentsDueTodayBookings,
  fetchAllCancelledBookings,
  fetchAdvancePaidBookingsNotDueToday,
  fetchAllBookedReciepts,
  fetchAllBookingsPastOccation,
  cancelSingleBooking,
  changeStatusToBooked,
  bookingHistoryOfSingleVenue,
} = require("../controllers/Booking");
const {
  createVenue,
  getSingleVenueDetails,
  editVenue,
  allAvailableVenues,
} = require("../controllers/FunctionHall");

// const middlewares
const { auth, isAuthorized } = require("../middlewares/Auth");

// initialize a router instance
const router = express.Router();

// #######################################################################
//                                Booking Routes
// #######################################################################
// bookings should only be created by managers
router.post("/create-booking", auth, isAuthorized, createNewBooking);
// reciepts are allowed to see by anyone
router.get("/fetch-reciepts", fetchReciepts);
// get all booking that need to be reminded for payment today
router.get(
  "/get-payment-due-today-bookings",
  auth,
  isAuthorized,
  fetchPaymentsDueTodayBookings
);
// fetch the booking that are cancelled
router.get(
  "/get-cencelled-bookings",
  auth,
  isAuthorized,
  fetchAllCancelledBookings
);
// get advance paid bookings whose payment due date is not today
router.get(
  "/get-advance-only-paid-bookings",
  auth,
  isAuthorized,
  fetchAdvancePaidBookingsNotDueToday
);
// get all bookings that completely paid money
router.get(
  "/get-completely-booked-reciepts",
  auth,
  isAuthorized,
  fetchAllBookedReciepts
);
// get all the bookings whose Occation is already completed
router.get(
  "/get-past-bookings",
  auth,
  isAuthorized,
  fetchAllBookingsPastOccation
);

// cancel a booking
router.put("/cancel-booking", auth, isAuthorized, cancelSingleBooking);
// chnage the stattus of the booking to completely paid
router.put("/complete-booking", auth, isAuthorized, changeStatusToBooked);
// fetch the booking history of a venue for a particular month and year
router.get("/booking-history", auth, isAuthorized, bookingHistoryOfSingleVenue);

// #######################################################################
//                                Venue Routes
// #######################################################################
// create a venue
router.post("/create-venue", auth, isAuthorized, createVenue);
// venue details
router.get("/venue-details", getSingleVenueDetails);
// edit the venue details
router.put("/edit-venue", auth, isAuthorized, editVenue);
// fetch all availbale venues on a particular date
router.get("/all-available-venues", allAvailableVenues);

// export the course routes
module.exports = router;
