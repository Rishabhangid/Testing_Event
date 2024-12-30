const mongoose = require("mongoose");

// const bookingSchema = new mongoose.Schema({
//     bookingId: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: "event_updated_booking", 
//         required: true 
//     },
//     createdAt: { 
//         type: Date, 
//         default: Date.now 
//     }
// })

// const Bookings = mongoose.model("booking_id", bookingSchema);

// // module.exports = Bookings;
// const mongoose = require("mongoose");

// // // Assuming the Event and User schemas are already defined elsewhere


// const bookingSchema = new mongoose.Schema({
//     bookingId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "event_updated_booking",
//         required: true
//     },
//     user_booking: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true
//     },
//     eventId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "event",
//         required: true
//     },
// },
//     { timestamps: true });

// const Bookings = mongoose.model("Bookings", bookingSchema);

// module.exports = Bookings;
// // booking_id

// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema(
//     {
//         event_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Event' }, // mil jaygi
//         bookingDetails_id: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'BookingDetails', // This references the BookingDetails schema
//             required: true,
//           },
//         bookingDetails_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'BookingDetails', },
//         event_from_date: { type: Date, required: true, }, event_to_date: { type: Date, required: true, }, // mil jaygi
//         ticket_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Ticket', }, // 
//         ticket_price: { type: Number, required: true, }, // 
//         no_of_members: { type: Number, required: true, }, // calculate krni pdegi
//         booked_by: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', }, // staff ki id
//         booked_at: { type: Date, default: Date.now, }, // 
//         created_at: { type: Date, default: Date.now, },
//         updated_at: { type: Date, default: Date.now, },
//     },
//     { timestamps: true }
// );

// const Booking = mongoose.model('Bookings', bookingSchema);

// module.exports = Booking;













// nya vala
const bookingSchema = new mongoose.Schema(
    {
      event_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Event',
      },
    //   bookingDetails_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'BookingDetails', // This references the BookingDetails schema
    //     required: true,
    //   },
      event_from_date: { type: Date, required: true },
      event_to_date: { type: Date, required: true },
      ticket_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Ticket' },
      ticket_price: { type: Number, required: true },
      no_of_members: { type: Number, required: true },
      booked_by: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
      booked_at: { type: Date, default: Date.now },
    },
    { timestamps: true }
  );
  
  const Booking = mongoose.model('Bookings', bookingSchema);
  
  module.exports = Booking;
  