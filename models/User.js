import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    alternateContactNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Customer"],
      required: true,
    },
    functionHall: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FunctionHall",
      },
    ],
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds "createdAt" and "updatedAt" fields to each document
  }
);

// Pre-save hook to hash the password before saving it to the database
userSchema.pre("save", async function (next) {
  // Code for hashing password
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model("User", userSchema);
