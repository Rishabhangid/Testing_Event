const mongoose = require('mongoose');

const eventHashtagsSchema = new mongoose.Schema({
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null },
  hashtags: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Pre-save middleware to update the 'updated_at' field on every update
eventHashtagsSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

const EventHashtags = mongoose.model('EventHashtags', eventHashtagsSchema);

module.exports = EventHashtags;
