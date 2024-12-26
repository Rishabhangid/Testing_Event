/**
 * Custom Error class for representing API-related errors.
 *
 * @class ApiError
 * @extends {Error}
 * @param {number} statusCode - The HTTP status code associated with the error.
 * @param {string} message - The error message providing details about the issue.
 * @param {boolean} [isOperational=true] - Indicates whether the error is operational or not.
 * @param {string} [stack=""] - The stack trace associated with the error (if available).
 */

class ApiError extends Error {
    constructor(statusCode, message, isOperational = true, stack = "") {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = isOperational;
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  
  module.exports = ApiError;