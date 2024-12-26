const mongoose = require("mongoose");


// const eventBookingSchema = new mongoose.Schema({
//     pictures: {
//         [
//             type: [String],
//         required: false,
//     },
//     names: {
//         type: [String],
//         required: true,
//     },
//     mobile_numbers: {
//         type: [String],
//         required: true,
//     },
//     emails: {
//         type: [String],
//         required: true,
//     },
//     organization_names: {
//         type: [String],
//         required: false,
//     },
//     cities: {
//         type: [String],
//         required: false,
//     },
//     created_at: {
//         type: Date,
//         default: Date.now,
//     },
//     updated_at: {
//         type: Date,
//         default: Date.now,
//     },
// });

const eventBookingSchema = new mongoose.Schema([
    {
        pictures: { type: [String], required: false },
        names: { type: [String], required: true },
        mobile_numbers: { type: [String], required: true },
        emails: { type: [String], required: true },
        organization_names: { type: [String], required: false },
        cities: { type: [String], required: false },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
    }
]);



const EventBooking = mongoose.model("event_booking", eventBookingSchema);

module.exports = EventBooking;



