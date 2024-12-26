const mongoose = require("mongoose");

const eventBannerSchema = new mongoose.Schema(
  {
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency", // Reference to the Agency schema
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value >= new Date(); // Start date cannot be in the past
        },
        message: "Start date cannot be in the past.",
      },
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.startDate; // End date must be after the start date
        },
        message: "End date must be later than start date.",
      },
    },
    bannerImage: {
      type: String, // URL or file path for the banner image
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending", // Admin approval status
    },
  },
  { timestamps: true }
);

const EventBanner = mongoose.model("EventBanner", eventBannerSchema);

module.exports.EventBanner = EventBanner;
