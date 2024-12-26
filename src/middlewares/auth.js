const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const config = require("../config/config")
dotenv.config();

// Middleware function to authenticate user requests using JWT
const auth = async (req, res, next) => {
	try {
		// Extract JWT from request headers (Authorization header)
		const token = req.header("Authorization")?.replace("Bearer ", "");
		// If JWT is missing, return 401 Unauthorized response
		if (!token) {
			return res.status(401).json({ success: false, message: `Token Missing` });
		}
		// Verify the extracted JWT with the secret key from config
		const decode = jwt.verify(token, config.jwt.secret);
		// Store the decoded JWT payload in the request object for further use
		req.user = decode;
		next();
	} catch (error) {
		// Handle different types of JWT errors
		if (error instanceof jwt.TokenExpiredError) {
			return res.status(401).json({ success: false, message: "Token Expired" });
		} else if (error instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({ success: false, message: "Invalid Token" });
		} else {
			console.error('Authentication error:', error);
			return res.status(500).json({ success: false, message: "Internal Server Error" });
		}
	}
};

module.exports = auth;