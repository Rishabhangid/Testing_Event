/**
 * 
 * Return a function that catches and forwards any error a function throws to the next middleware 
 * 
 * why catchAsync :  catchAsync function is to wrap around an asynchronous function (fn) 
 *                   and ensure that any errors thrown by that function 
 *                   are caught and forwarded to the next middleware
 * 
 * @param {Function} fn - input function that catchAsync wraps around
 */
function catchAsync(fn) {
    return function(req, res, next) {
      Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    }
  }
  
  module.exports = catchAsync;