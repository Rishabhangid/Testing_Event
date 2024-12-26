
const mongoose = require("mongoose");

const eventTypeSchema = new mongoose.Schema(
  {

  
    package_type:{
      type: String,
      required: true,
      unique: true, // Ensures no duplicate event types
      trim: true,
      maxlength: 50,
    },
    currency:{
      type: String,
      required: true,
      unique: true, // Ensures no duplicate event types
      trim: true,
      maxlength: 50,
    },
    package_date:{
      type: String, // Optional description for the event type
      trim: true,
      maxlength: 200,
      required:true
    },
    package_amount:{
      type: Number, // Optional description for the event type
      trim: true,
      maxlength: 200,
      required:true
    },
    package_description:{
      type: String, // Optional description for the event type
      trim: true,
      maxlength: 200,
      required:true
    },
    event_id:{
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

const EventPackage = mongoose.model("EventPackage", eventTypeSchema);

module.exports.EventPackage = EventPackage;
