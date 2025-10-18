const mongoose = require("mongoose");

const lawyerProfileSchema = new mongoose.Schema(
  {
    lawyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One profile per lawyer
    },
    experience: {
      type: Number, // in years
      required: false,
      default: 0,
    },
    aboutMe: {
      type: String,
      required: false,
      trim: true,
    },
    contactInfo: {
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      officeLocation: {
        type: String,
        required: false,
        trim: true,
      },
      languages: {
        type: [String], // e.g., ["English", "Sinhala", "Tamil"]
        default: [],
      },
    },
    profilePicture: {
      type: String, // store image file path or URL
      default: "", // empty by default
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    availability: {
      days: {
        type: [String], // e.g., ["Monday", "Tuesday", "Friday"]
        default: [],
      },
      timeSlots: {
        type: [
          {
            start: { type: String, required: true }, // "09:00"
            end: { type: String, required: true }, // "17:00"
          },
        ],
        default: [],
      },
      isAvailable: {
        type: Boolean,
        default: true, // false if on vacation or unavailable
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LawyerProfile", lawyerProfileSchema);
