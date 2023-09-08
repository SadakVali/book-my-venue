const mongoose = require("mongoose");

const otherPoliciesSchema = new mongoose.Schema(
  {
    isMusicAllowedLateAtNight: {
      type: Boolean,
      required: true,
    },
    isHallAirConditioned: {
      type: Boolean,
      required: true,
    },
    isBaaratAllowed: {
      type: Boolean,
      required: true,
    },
    fireCrackersAllowed: {
      type: Boolean,
      required: true,
    },
    isHawanAllowed: {
      type: Boolean,
      required: true,
    },
    isOverNightWeddingAllowed: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const OtherPolicies = mongoose.model("OtherPolicies", otherPoliciesSchema);

module.exports = OtherPolicies;
