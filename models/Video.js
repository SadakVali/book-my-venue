import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    timeDuration: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Video", videoSchema);
