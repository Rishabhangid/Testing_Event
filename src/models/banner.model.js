const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value >= new Date(); // Start date must not be in the past
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
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);

module.exports.Banner = Banner;
