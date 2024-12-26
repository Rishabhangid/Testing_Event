const mongoose = require('mongoose');

const eventPackageSchema = new mongoose.Schema({
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null },
  title: { type: String, default: null },
  amount: { type: mongoose.Decimal128, default: null },
  cut_off_date: { type: Date, default: null },
  total_guests: { type: Number, default: null },
  durations: { type: Number, default: null },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  people_range: { type: String, default: null },
  people_range_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PeopleRange', default: null },
  currency_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Currency', default: null },
  is_deleted: { type: Boolean, default: false },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  description: { type: String, required: true },
  available_package: { type: Number, default: null },
  total_available_packages: { type: Number, default: null },
  guests_covered: { type: Boolean, default: true },
  guests_count: { type: Number, default: null },
  package_inclusions: { type: String, default: null },
  early_bird_offer: { type: Boolean, default: false },
  early_bird_offer_amount: { type: mongoose.Decimal128, default: null },
  early_bird_offer_start_date: { type: Date, default: null },
  early_bird_offer_end_date: { type: Date, default: null },
  early_bird_offer_start_time: { type: String, default: null },
  early_bird_offer_end_time: { type: String, default: null },
  last_minute_offer: { type: Boolean, default: false },
  last_minute_offer_amount: { type: mongoose.Decimal128, default: null },
  last_minute_offer_start_date: { type: Date, default: null },
  last_minute_offer_end_date: { type: Date, default: null },
  last_minute_offer_start_time: { type: String, default: null },
  last_minute_offer_end_time: { type: String, default: null },
  others: { type: Boolean, default: false },
  early_bird_offer_currency: { type: mongoose.Schema.Types.ObjectId, ref: 'Currency', default: null },
  last_minute_offer_currency: { type: mongoose.Schema.Types.ObjectId, ref: 'Currency', default: null },
});

const EventPackage = mongoose.model('EventPackage', eventPackageSchema);

module.exports = EventPackage;
