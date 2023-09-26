// const modules
const express = require("express");

// const controllers
const {
  fetchSingleCustomerReciepts,
  fetchAllCancelledBookings,
  fetchAdvancePaidBookings,
  fetchAllBookedReciepts,
  fetchAllBookingsPastOccation,
  cancelSingleBooking,
  changeStatusToBooked,
  updatePaymentSummary,
  fetchPaymentsDueTodayBookings,
} = require("../controllers/Dashboard");

// const middlewares
const { auth, isAuthorized } = require("../middlewares/Auth");

// initialize a router instance
const router = express.Router();

// #######################################################################
//                                Dashboard Routes
// #######################################################################
// customer reciepts are allowed to see by anyone
router.post("/fetch-customer-reciepts", fetchSingleCustomerReciepts);
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
  fetchAdvancePaidBookings
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
  "/get-bookings-past-occation",
  auth,
  isAuthorized,
  fetchAllBookingsPastOccation
);
// get all booking that need to be reminded for payment today
router.get(
  "/get-payment-due-today-bookings",
  auth,
  isAuthorized,
  fetchPaymentsDueTodayBookings
);

// cancel a booking
router.put("/cancel-booking", auth, isAuthorized, cancelSingleBooking);
// chnage the stattus of the booking to completely paid
router.put("/complete-a-booking", auth, isAuthorized, changeStatusToBooked);
// udate the summary of a booking reciept
router.put("/update-summary", auth, isAuthorized, updatePaymentSummary);

// export the course routes
module.exports = router;
