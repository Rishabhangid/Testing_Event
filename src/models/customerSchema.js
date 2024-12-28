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
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;



