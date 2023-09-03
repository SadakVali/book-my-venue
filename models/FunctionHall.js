import mongoose from "mongoose";

const functionHallSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: [String],
    price: {
      type: Number,
      required: true,
      min: 0,
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
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    gpsCoordinates: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GPS",
      required: true,
    },
    bookingDates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BookingInfo",
        required: true,
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
