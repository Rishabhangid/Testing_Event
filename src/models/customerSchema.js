// const mongoose = require("mongoose");

// const customerSchema = new mongoose.Schema(
//     {
//         email: {
//             type: String,
//             required: true,
//             unique: true,
//         },
//         password: {
//             type: String,
//             required: true,
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
//         },
//         city: {
//             type: String,
//             required: true,
//         },
//         state: {
//             type: String,
//             required: true,
//         },
//         zipcode: {
//             type: String,
//             required: true,
//         }
//     },
//     {
//         timestamps: true
//     }
// );

// const Customer = mongoose.model('Customers', customerSchema);
// module.exports = Customer;


const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    number: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 15,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;



