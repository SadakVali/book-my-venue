import mongoose from "mongoose";

const GPSSchema = new mongoose.Schema(
  {
    location: {
      type: {
        type: String,
        enum: ["Point"], // Only allow the "Point" type
        default: "Point", // Set the default value to "Point"
        required: true,
      },
      coordinates: {
        type: [Number], // longitude first, and then latitude
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const GPS = mongoose.model("GPS", GPSSchema);

export default GPS;
