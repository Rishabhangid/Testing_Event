const mongoose = require("mongoose");

     

const eventBookingSchemaNew = new mongoose.Schema({
    users: [
        {
            pictures: { type: String, required: false },
            names: { type: String, required: true },
            mobile_numbers: { type: String, required: true },
            emails: { type: String, required: true },
            organization_names: { type: String, required: false },
            cities: { type: String, required: false },
            created_at: { type: Date, default: Date.now },
            updated_at: { type: Date, default: Date.now },
            qr_code: { type: String, required: false },
            isPresent :{ type:Boolean, default: false ,required : false }

        }
    ]
});



const EventBookingNews = mongoose.model("Booking_details", eventBookingSchemaNew);
// event_updated_booking

module.exports = EventBookingNews;






