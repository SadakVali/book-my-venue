import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
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
      required: true,
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
      type: String,
      required: true,
      trim: true,
    },
    GPS: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GPS",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("Address", addressSchema);

export default Address;
