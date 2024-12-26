const mongoose = require('mongoose');

const eventGallerySchema = new mongoose.Schema({
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null },
  mime_type: { type: String, required: true },
  filename: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Pre-save middleware to update the 'updated_at' field on every update
eventGallerySchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

const EventGallery = mongoose.model('EventGallery', eventGallerySchema);

module.exports = EventGallery;
