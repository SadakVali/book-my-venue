// const modules
const express = require("express");

const {
  createVenue,
  getSingleVenueDetails,
  editVenue,
  fetchAvailableVenuesGivenDates,
  fetchAllVenues,
} = require("../controllers/Venue");

// const middlewares
const { auth, isAuthorized } = require("../middlewares/Auth");

// initialize a router instance
const router = express.Router();

// #######################################################################
//                                Venue Routes
// #######################################################################
// create a venue
router.post("/create-venue", auth, isAuthorized, createVenue);
// venue details
router.post("/venue-details", getSingleVenueDetails);
// edit the venue details
router.put("/edit-venue", auth, isAuthorized, editVenue);
// fetch all availbale venues on a particular date
router.get("/all-available-venues", fetchAvailableVenuesGivenDates);
// fetch all venues in the city
router.get("/all-available-venues", fetchAllVenues);

// export the course routes
module.exports = router;
