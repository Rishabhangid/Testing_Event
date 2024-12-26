const mongoose = require('mongoose');

// Define the Currency schema
const CurrencySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true, // Ensure currency codes (e.g., USD, EUR) are stored in uppercase
    },
    name: {
      type: String,
      required: true,
      trim: true, // Name of the currency (e.g., "US Dollar", "Euro")
    },
    symbol: {
      type: String,
      required: true, // Symbol for the currency (e.g., "$", "€")
      unique: true,
    },
   
    isActive: {
      type: Boolean,
      default: true, // Indicates whether the currency is active or not
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create the Currency model
const Currency = mongoose.model('Currency', CurrencySchema);

module.exports.Currency =  Currency 
