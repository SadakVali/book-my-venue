const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
    trim: true,
  },
  landmark: {
    type: String,
    required: true,
    trim: true,
  },
  distanceFromLandmark: {
    type: String,
    trim: true,
  },
  village: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  pin: {
    type: Number,
    required: true,
    trim: true,
  },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  // location: {
  //   type: {
  //     type: String,
  //     enum: ["Point"], // Only allow the "Point" type
  //     default: "Point", // Set the default value to "Point"
  //   },
  //   coordinates: {
  //     type: [Number], // longitude first, and then latitude
  //     required: true,
  //   },
  // },
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
