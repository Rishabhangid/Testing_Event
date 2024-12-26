const mongoose = require('mongoose');

const eventSponsorDetailsSchema = new mongoose.Schema({
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null },
  sponsors_brand_logo: { type: String, default: null },
  sponsor_name: { type: String, default: null },
  sponsor_details: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  sponsor_number: { type: String, default: null },
  inclusions: { type: String, default: null },
  sponsor_address: { type: String, default: null },
  country_code: { type: String, default: null },
  sponsored_package_rate: { type: String, default: null },
  currency_id: { type: Number, default: null }
});

// Pre-save middleware to update the 'updated_at' field on every update
eventSponsorDetailsSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

const EventSponsorDetails = mongoose.model('EventSponsorDetails', eventSponsorDetailsSchema);

module.exports = EventSponsorDetails;
