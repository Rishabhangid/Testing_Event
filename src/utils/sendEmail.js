const nodemailer = require('nodemailer');

const sendEmail = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  return transporter.sendMail(mailOptions);
};

// const sendEmail = async (mailOptions) => {
//   const transporter = nodemailer.createTransport({
//     name: process.env.EMAIL_HOST,
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_SMTPPORT,
//     secure: true,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   return transporter.sendMail(mailOptions);
// };

module.exports = sendEmail;
