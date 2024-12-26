const Joi = require("joi");
const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");

/**
 * Middleware function that validates user requests against a pre define Joi schema for validation
 */
const validate = (schema) => (req, res, next) => {
  const isMultipart = req.is("multipart/form-data");
  const isJson = req.is("application/json");
  if (!isMultipart && !isJson && Object.keys(req.body).length !== 0) {
    return next(
        new ApiError(
            httpStatus.UNSUPPORTED_MEDIA_TYPE,
            "Supports JSON or multipart/form-data request body only"
        )
    );
}
    // Extracting valid schema properties for validation
    const validSchema = pick(schema, ["params", "query", "body"]);

    // Extracting relevant properties from the request for validation
    const object = pick(req, Object.keys(validSchema));
    // Validating the request against the compiled schema
    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: "key" } })
        .validate(object);
    // Handling validation errors and sending a meaningful error response
    if (error) {
        const errorMessage = error.details
            .map((details) => details.message).join(", ")
            
        return res.status(400).json({message:errorMessage});
    }
    Object.assign(req, value);

    return next();
};
module.exports = validate;
