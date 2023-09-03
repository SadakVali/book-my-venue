import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
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
  {
    timestamps: true,
  }
);

const Food = mongoose.model("Food", foodSchema);

export default Food;
