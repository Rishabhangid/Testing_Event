const mongoose = require("mongoose");

const eventNotificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500, // Set a max length for the message
    },
    notificationType: {
      type: String,
      enum: ["Info", "Warning", "Success", "Error"], // Define types of notifications
      required: true,
    },
    is_read: {
      type: Boolean,
      default: false, // Default value as unread
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100, // Set a max length for the title
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    url: {
      type: String,
      trim: true, // Optional URL field for linking
    },
    isActive: {
      type: Boolean,
      default: true, // To activate or deactivate the notification
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const EventNotification = mongoose.model("EventNotification", eventNotificationSchema);

module.exports.EventNotification = EventNotification;
