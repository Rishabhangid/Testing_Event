const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    contactDetails: {
      phone: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },
    logo: {
      type: String,
      trim: true,
    },
    kycDetails: {
      panCard: { type: String, trim: true },
      aadhaarCard: { type: String, trim: true },
    },
    kycStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    adminApprovalStatus: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Agency = mongoose.model("Agency", agencySchema);

module.exports.Agency = Agency;
