const mongoose = require('mongoose');

const eventTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_deleted: { type: Boolean, default: false }
});

// Pre-save middleware to update the 'updated_at' field on every update
eventTypeSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

const EventType = mongoose.model('EventType', eventTypeSchema);

module.exports = EventType;
