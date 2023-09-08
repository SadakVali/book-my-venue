const mongoose = require("mongoose");

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
    lodgingRooms: {
      type: Number,
      required: true,
    },
    roomPrice: {
      type: Number,
      required: true,
    },
    bookingCancellation: {
      type: Boolean,
      required: true,
    },
    food: {
      cateringProvidedByVenue: {
        type: Boolean,
        required: true,
      },
      outsideCatererAllowed: {
        type: Boolean,
        required: true,
      },
      nonVegAllowedAtVenue: {
        type: Boolean,
        required: true,
      },
      vegPricePerPlate: {
        type: Number,
      },
      NonvegPricePerPlate: {
        type: Number,
      },
    },
    alcohol: {
      alcoholProvidedByVenue: {
        type: Boolean,
        required: true,
      },
      outsideAlcoholAllowed: {
        type: Boolean,
        required: true,
      },
    },
    decoration: {
      decorProvidedByVenue: {
        type: Boolean,
        required: true,
      },
      outsideDecoratersAllowed: {
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
      fireCrackersAllowed: {
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
    video: [
      {
        url: { type: String, required: true, trim: true },
        publicId: { type: String, required: true, trim: true },
        duration: { type: String, required: true, trim: true },
      },
    ],
    pricePerDay: {
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
      enum: ["Draft", "Published"],
    },
  },
  {
    timestamps: true,
    strictPopulate: false,
  }
);

const Venue = mongoose.model("Venue", venueSchema);

module.exports = Venue;
