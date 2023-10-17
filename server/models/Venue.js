// const libraries
const mongoose = require("mongoose");

// const constants
const { VENUE_STATUS } = require("../utils/constants");

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    aboutVenue: {
      type: String,
      required: true,
      trim: true,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    advancePercentage: {
      type: Number,
      required: true,
    },
    guestCapacity: {
      type: Number,
      required: true,
    },
    carParkingSpace: {
      type: Number,
      required: true,
    },
    numOfLodgingRooms: {
      type: Number,
      required: true,
    },
    lodgingRoomPrice: {
      type: Number,
      required: true,
    },
    isBookingCancellable: {
      type: Boolean,
      required: true,
    },
    cancellationCharges: {
      type: Boolean,
      required: true,
    },
    food: {
      isCateringProvidedByVenue: {
        type: Boolean,
        required: true,
      },
      isOutsideCatererAllowed: {
        type: Boolean,
        required: true,
      },
      // TODO: Newly added field
      outsideCatererAllowingCharges: {
        type: Boolean,
        required: true,
      },
      isNonVegAllowedAtVenue: {
        type: Boolean,
        required: true,
      },
      vegPricePerPlate: {
        type: Number,
        required: true,
      },
      nonvegPricePerPlate: {
        type: Number,
        required: true,
      },
    },
    alcohol: {
      // TODO: Newly added field
      isItAllowed: {
        type: Boolean,
        required: true,
      },
      isAlcoholProvidedByVenue: {
        type: Boolean,
        required: true,
      },
      isOutsideAlcoholAllowed: {
        type: Boolean,
        required: true,
      },
      // TODO: Newly added field
      outsideAlcoholAllowingCharges: {
        type: Boolean,
        required: true,
      },
    },
    decoration: {
      isDecorProvidedByVenue: {
        type: Boolean,
        required: true,
      },
      // TODO: Newly added field
      outsideDecorAllowingCharges: {
        type: Boolean,
        required: true,
      },
      isOutsideDecoratersAllowed: {
        type: Boolean,
        required: true,
      },
    },
    otherPolicies: {
      isMusicAllowedLateAtNight: {
        type: Boolean,
        required: true,
      },
      isHallAirConditioned: {
        type: Boolean,
        required: true,
      },
      isBaaratAllowed: {
        type: Boolean,
        required: true,
      },
      areFireCrackersAllowed: {
        type: Boolean,
        required: true,
      },
      isHawanAllowed: {
        type: Boolean,
        required: true,
      },
      isOverNightWeddingAllowed: {
        type: Boolean,
        required: true,
      },
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    images: [
      {
        url: { type: String, required: true, trim: true },
        publicId: { type: String, required: true, trim: true },
      },
    ],
    videos: [
      {
        url: { type: String, required: true, trim: true },
        publicId: { type: String, required: true, trim: true },
        duration: { type: String, required: true, trim: true },
      },
    ],
    venuePricePerDay: {
      type: Number,
      required: true,
    },
    allBookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BookingInfo",
      },
    ],
    status: {
      type: String,
      enum: [VENUE_STATUS.DRAFT, VENUE_STATUS.PUBLISHED],
      required: true,
    },
  },
  {
    timestamps: true,
    strictPopulate: false,
  }
);

const Venue = mongoose.model("Venue", venueSchema);
module.exports = Venue;
