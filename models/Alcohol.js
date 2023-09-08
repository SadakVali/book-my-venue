const mongoose = require("mongoose");

const alcoholSchema = new mongoose.Schema(
  {
    alcoholProvidedByVenue: {
      type: Boolean,
      required: true,
    },
    outsideAlcoholAllowed: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Alcohol = mongoose.model("Alcohol", alcoholSchema);

module.exports = Alcohol;
