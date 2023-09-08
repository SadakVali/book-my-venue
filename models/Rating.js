// const the mongoose library
const mongoose = require("mongoose");

// define the schema for the rating and review
const ratingSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
    },
    numberOfPeoples: {
      type: Number,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
    },
  },
  { timestamps: true }
);

// export the model directly without saving it in a variable
module.exports = mongoose.model("Rating", ratingSchema);
