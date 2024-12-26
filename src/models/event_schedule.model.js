const mongoose = require('mongoose');

const eventScheduleSchema = new mongoose.Schema({
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  date: { type: Date, default: null },
  title: { type: String, default: null },
  start_time: { type: String, default: null },
  end_time: { type: String, default: null },
  description: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Pre-save middleware to update the 'updated_at' field on every update
eventScheduleSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

const EventSchedule = mongoose.model('EventSchedule', eventScheduleSchema);

module.exports = EventSchedule;
