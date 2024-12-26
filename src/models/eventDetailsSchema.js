const mongoose = require("mongoose");

const eventDetailsSchema = new mongoose.Schema({
    id: {
        type: Number,
        auto: true, 
    },
    event_id: {
        type: Number,
        required: true,
        default: 111,
    },
    customer_name: {
        type: String,
        required: true,
    },
    customer_picture: {
        type: String,
        required: true,
    },
    customer_mobile: {
        type: String,
        required: true,
    },
    customer_email: {
        type: String,
        required: true,
    },
    customer_organization: {
        type: String,
        required: true, 
    },
    customer_city: {
        type: String,
        required: true,
    },
    event_ticket_id: {
        type: Number,
        required: true,
        default: 111111,
    },
    ticket_amount: {
        type: Number,
        required: true,
    },
    created_by: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now, 
    },
    updated_at: {
        type: Date,
        default: Date.now, 
    },
});

const EventDetails = mongoose.model("event_details", eventDetailsSchema);

module.exports = EventDetails;
