const mongoose = require('mongoose');

const eventModeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_active: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false }
});

// Pre-save middleware to update the 'updated_at' field on every update
eventModeSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

const EventMode = mongoose.model('EventMode', eventModeSchema);

module.exports = EventMode;
