const mongoose = require("mongoose");

const SpeakerSchema = new mongoose.Schema(
  {
    profile_picture: {
      type: String, // URL or path to the photo
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true, // Removes extra spaces
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event", // Assuming there's an "Event" model to reference
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

module.exports.SpeakerSchema = mongoose.model("Speaker", SpeakerSchema);
