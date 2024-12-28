const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    bookingId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "event_updated_booking", 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
})

const Bookings = mongoose.model("booking_id", bookingSchema);

module.exports = Bookings;
