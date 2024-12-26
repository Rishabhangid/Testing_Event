const mongoose = require('mongoose');

// Define the PackageType schema
const EventTicketsSchema = new mongoose.Schema(
    {
        event_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        amount: {
            type: mongoose.Decimal128,
            default: null
        },
        currency: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Currency",
            default: null,
        },
        description: {
            type: String,
            trim: true,
        },
        start_date: {
            type: Date,
            default: null
        },
        end_date: {
            type: Date,
            default: null
        },
        isActive: {
            type: Boolean,
            default: true, // Whether the package type is active
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

// Create the EventTickets model
const EventTickets = mongoose.model('EventTickets', EventTicketsSchema);

module.exports.EventTickets = EventTickets
