const express = require("express");
const cors = require("cors");
const httpStatus = require("http-status");
const ApiError = require("./utils/ApiError");
const helmet = require("helmet");
const multer=require("multer")
const public_routes = require("./routes/public");
const private_routes = require("./routes/private");
const path = require("path");
const app = require("./uploads/imageRoute");
const main = express();
const uploade=multer()

// main.use(helmet());
main.use(helmet.contentSecurityPolicy({directives: {defaultSrc:["'self'"], imgSrc:["'self'", "data:"],},}));
main.use(express.json());
main.use(express.urlencoded({ extended: true }));

main.use('uploads/eventBookings', express.static(path.join(__dirname, 'uploads', 'eventBookings')));
main.use('uploads/eventDetails', express.static(path.join(__dirname, 'uploads', 'eventDetails')));
main.use('uploads/qrCode', express.static(path.join(__dirname, 'uploads', 'qrCode')));

main.use(cors());
main.options("*", cors());

main.use("/v1/api", public_routes);
main.use("/v1/auth", private_routes);
main.use("/public",app)

main.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    // If the error is an instance of ApiError, send a custom error response
    res.status(err.statusCode || 400).json({
      success: false,
      message: err.message || "An error occurred",
      statusCode: err.statusCode,
      statusCode: 400,
    });
  } else {
    // For other errors, send a generic response
    console.error(err,"-----error")
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      statusCode: 500,
    });
  }
});

module.exports = main;
