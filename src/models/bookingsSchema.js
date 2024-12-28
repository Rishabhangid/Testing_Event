// const mongoose = require("mongoose");

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

// module.exports = Bookings;
const mongoose = require("mongoose");

// Assuming the Event and User schemas are already defined elsewhere


const bookingSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "event_updated_booking",
        required: true
    },
    user_booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "event",
        required: true
    },
},
    { timestamps: true });

const Bookings = mongoose.model("Bookings", bookingSchema);
// booking_id

module.exports = Bookings;

