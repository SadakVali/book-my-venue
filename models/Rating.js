// import the mongoose library
import mongoose from "mongoose";

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
      ref: "FunctionHall",
    },
  },
  { timestamps: true }
);

// export the model directly without saving it in a variable
module.exports = mongoose.model("Rating", ratingSchema);
