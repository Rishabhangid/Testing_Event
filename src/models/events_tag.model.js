const mongoose = require('mongoose');

const eventTagSchema = new mongoose.Schema({
  interest_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Interest', default: null },
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null }
});

const EventTag = mongoose.model('EventTag', eventTagSchema);

module.exports = EventTag;
