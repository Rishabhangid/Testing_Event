
const config = require("../config/config");
const httpStatus = require("http-status");
// const ApiError = require("../utils/ApiError");

/**
 * 
 * Module responsible for handling errors and sending appropriate responses.
 * @module ErrorHandler
 *
 * Express middleware function to handle errors and send corresponding responses.
 * @function errorHandler
 * @param {Error} err - The error object.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
const errorHandler = (err, req, res, next) => {
    // Extract status code and error message from the error object
    let { statusCode, message } = err;

    // Store the error message in the response locals for potential future use
    res.locals.errorMessage = err.message;

    // Create the response object with status code and error message
    const response = {
        code: statusCode,
        message,
        // Include stack trace in the response in development environment
        ...(config.env === "development" && { stack: err.stack }),
    };

    // Log the error in the console if the environment is set to development
    if (config.env === "development") {
        console.error(err);
    }

    // Set the HTTP status code and send the response
    res.status(statusCode).send(response);
};

// Export the errorHandler function for use in other modules
module.exports = {
    errorHandler,
};
