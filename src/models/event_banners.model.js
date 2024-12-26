const mongoose = require('mongoose');

const eventBannerSchema = new mongoose.Schema({
  mime_type: { type: String, default: null },
  filename: { type: String, default: null },
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Pre-save middleware to update the 'updated_at' field on every update
eventBannerSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

const EventBanner = mongoose.model('EventBanner', eventBannerSchema);

module.exports = EventBanner;
