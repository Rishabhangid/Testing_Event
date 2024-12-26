
const mongoose = require("mongoose");

const eventTypeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate event types
      trim: true,
      maxlength: 50,
    },
    description: {
      type: String, // Optional description for the event type
      trim: true,
      maxlength: 200,
      required:true
    },
    is_active: {
      type: Boolean,
      default: true, // Indicates if this event type is active
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const EventType = mongoose.model("EventType", eventTypeSchema);

module.exports.EventType = EventType;
