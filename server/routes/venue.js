// const modules
const express = require("express");

const {
  createVenue,
  // getCompleteSingleVenueDetails,
  editVenue,
  // fetchAvailableVenuesGivenDates,
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
// router.post("/venue-complete-details", getCompleteSingleVenueDetails);
// edit the venue details
router.put("/edit-venue", auth, isAuthorized, editVenue);
// // fetch all availbale venues on a particular date
// router.get("/all-available-venues", fetchAvailableVenuesGivenDates);
// fetch all venues in the city
router.post("/get-details-of-all-venues", fetchAllVenues);

// export the course routes
module.exports = router;
