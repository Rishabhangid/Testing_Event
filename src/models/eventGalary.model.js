const mongoose = require("mongoose");

const eventGallerySchema = new mongoose.Schema(
  {
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event", // Reference to the Event model
      required: true,
    },
    media: {
      type: String, // URL or file path for the media (image/video)
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true, // Determines if the gallery item is active
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const EventGallery = mongoose.model("EventGallery", eventGallerySchema);

module.exports.EventGallery = EventGallery;
