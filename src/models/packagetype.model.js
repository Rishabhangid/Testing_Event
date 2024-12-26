const mongoose = require('mongoose');

// Define the PackageType schema
const PackageTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Ensure package type names are unique
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true, // Whether the package type is active
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create the PackageType model
const PackageType = mongoose.model('PackageType', PackageTypeSchema);

module.exports.PackageType = PackageType
