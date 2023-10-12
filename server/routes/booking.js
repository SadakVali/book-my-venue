// const modules
const express = require("express");

// const controllers
const {
  createNewBooking,
  bookingsOfVenueGivenMonth,
} = require("../controllers/Booking");

// const middlewares
const { auth, isAuthorized } = require("../middlewares/Auth");

// initialize a router instance
const router = express.Router();

// #######################################################################
//                                Booking Routes
// #######################################################################
// bookings should only be created by managers
router.post("/create-booking", auth, isAuthorized, createNewBooking);
// fetch the booking history of a venue for a particular month and year
router.post(
  "/bookings-given-month",
  auth,
  isAuthorized,
  bookingsOfVenueGivenMonth
);

// export the course routes
module.exports = router;
