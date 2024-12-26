const mongoose = require('mongoose');

const eventSheduleUploadDocumentSchema = new mongoose.Schema({
  mime_type: { type: String, default: null },
  file: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null },
  date: { type: Date, default: null }
});

// Pre-save middleware to update the 'updated_at' field on every update
eventSheduleUploadDocumentSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

const EventSheduleUploadDocument = mongoose.model('EventSheduleUploadDocument', eventSheduleUploadDocumentSchema);

module.exports = EventSheduleUploadDocument;
