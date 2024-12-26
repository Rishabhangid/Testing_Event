const mongoose = require('mongoose');

// Country Schema
const countrySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

// State Schema
const stateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country_id: { type:Number, ref: 'Country', required: true },
});

// City Schema
const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  state_id: { type:Number, ref: 'State', required: true },
  country_id: { type:Number, ref: 'Country', required: true },
});

// Models
const Country = mongoose.model('Country', countrySchema);
const State = mongoose.model('State', stateSchema);
const City = mongoose.model('City', citySchema);

// Export models
module.exports = {
  Country,
  State,
  City,
};
