import mongoose from "mongoose";

const functionHallSchema = new mongoose.Schema(
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
    images: [{ url: { type: String }, publicId: { type: String } }],
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    alcohol: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alcohol",
      required: true,
    },
    decoration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Decoration",
      required: true,
    },
    otherPolicies: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OtherPolicies",
      required: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    video: {
      url: { type: String, required: true, trim: true },
      publicId: { type: String, required: true, trim: true },
      duration: { type: String, required: true, trim: true },
    },
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

const FunctionHall = mongoose.model("FunctionHall", functionHallSchema);

export default FunctionHall;
