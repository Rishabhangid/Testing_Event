// const mongoose = require("mongoose");

// const customerSchema = new mongoose.Schema(
//     {
//         email: {
//             type: String,
//             required: true,
//             unique: true,
//             lowercase: true,
//             trim: true,
//             match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
//         },
//         password: {
//             type: String,
//             required: true,
//             minlength: [6, "Password must be at least 6 characters long"],
//         },
//         address: {
//             type: String,
//             required: true,
//         },
//         number: {
//             type: Number,
//             required: true,
//         },
//         country: {
//             type: Number,
//             required: true,
//         }
//     },
//     {
//         timestamps: true
//     }
// );

// const Customer = mongoose.model('Customers', customerSchema);
// module.exports = Customer

const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        number: {
            type: Number,
            required: true,
        },
        country: {
            type: Number,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        zipcode: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

const Customer = mongoose.model('Customers', customerSchema);
module.exports = Customer;

