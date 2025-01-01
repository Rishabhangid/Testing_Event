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

module.exports = sendEmail;
