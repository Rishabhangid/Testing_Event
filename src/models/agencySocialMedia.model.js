const mongoose = require("mongoose");

const socialMediaSchema = new mongoose.Schema(
  {
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency", // Reference to the Agency model
      required: true,
    },
    youtube: {
      type: String,
      trim: true,
      match: /^https?:\/\/(www\.)?youtube\.com\/.+$/, // Validates YouTube URLs
    },
    instagram: {
      type: String,
      trim: true,
      match: /^https?:\/\/(www\.)?instagram\.com\/.+$/, // Validates Instagram URLs
    },
    x: {
      type: String,
      trim: true,
      match: /^https?:\/\/(www\.)?(x\.com|twitter\.com)\/.+$/, // Validates X (formerly Twitter) URLs
    },
    facebook: {
      type: String,
      trim: true,
      match: /^https?:\/\/(www\.)?facebook\.com\/.+$/, // Validates Facebook URLs
    },
    linkedin: {
      type: String,
      trim: true,
      match: /^https?:\/\/(www\.)?linkedin\.com\/.+$/, // Validates LinkedIn URLs
    },
    isActive: {
      type: Boolean,
      default: true, // Indicates whether the social media links are active
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const SocialMedia = mongoose.model("SocialMedia", socialMediaSchema);

module.exports.SocialMedia = SocialMedia;
