const mongoose = require("mongoose");



// const eventBookingSchemaNew = new mongoose.Schema({
//     users: [
//         {
//             pictures: { type: String, required: false },
//             names: { type: String, required: true },
//             mobile_numbers: { type: String, required: true },
//             emails: { type: String, required: true },
//             organization_names: { type: String, required: false },
//             cities: { type: String, required: false },
//             created_at: { type: Date, default: Date.now },
//             updated_at: { type: Date, default: Date.now },
//             qr_code: { type: String, required: false },
//             code: { type: Number, required: true },
//             isPresent: { type: Boolean, default: false, required: false }

//         }
//     ],
//     ticket_booker: { type: mongoose.Schema.Types.ObjectId, ref: "customers", required: true },
//     eventId : { type: mongoose.Schema.Types.ObjectId, ref: "event", required: true },
// }, { timestamps: true });



// const EventBookingNews = mongoose.model("Booking_details", eventBookingSchemaNew);
// // event_updated_booking

// module.exports = EventBookingNews;










//  NYA VALA
const bookingDetailsSchema = new mongoose.Schema(
    {
        customer_picture: { type: String, },
        customer_name: { type: String, required: true, },
        customer_phone: { type: String, required: true, },
        customer_email: { type: String, required: true, },
        customer_city: { type: String, },
        customer_organisation: { type: String, },
        customer_qr_picture: { type: String, },
        customer_qr_code: { type: String, },
        is_cancelled: { type: Boolean, default: false, },
        booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }, 
    },
    { timestamps: true }
);


const BookingDetails = mongoose.model('BookingDetails', bookingDetailsSchema);

module.exports = BookingDetails;





