const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
      event_id: {  type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Event' },
      event_from_date: { type: Date, required: true },
      event_to_date: { type: Date, required: true },
    //   ticket_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Ticket' },
      ticket_id: { type: Number , required: true },
      ticket_price: { type: Number, required: true },
      no_of_members: { type: Number, required: true },
      booked_by: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
      booked_at: { type: Date, default: Date.now },
    },
    { timestamps: true }
  );
  
  const Booking = mongoose.model('Bookings', bookingSchema);
  
  module.exports = Booking;
  