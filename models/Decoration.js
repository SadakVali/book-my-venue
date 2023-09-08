const mongoose = require("mongoose");

const decorationSchema = new mongoose.Schema(
  {
    decorProvidedByVenue: {
      type: Boolean,
      required: true,
    },
    outsideDecoratersAllowed: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Decoration = mongoose.model("Decoration", decorationSchema);

module.exports = Decoration;
