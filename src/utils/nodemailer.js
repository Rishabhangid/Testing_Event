// utils/nodemailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Replace with your service
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// const transporter = nodemailer.createTransport({
//     name: process.env.EMAIL_HOST,
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_SMTPPORT,
//     secure: true,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

module.exports = transporter;
