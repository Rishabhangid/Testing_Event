const { User } = require("../models");

const checkEmailAndPhone = async (req, res, next) => {
    console.log(req.body, "---------------req.body---------------",req.files);
  try {
    const { email, phone } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }
    // Check if phone is provided
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }
    
    // Check if email exists in the database
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email is already taken.",
      });
    }

    // Check if phone exists in the database
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({
        success: false,
        message: "Phone number is already taken.",
      });
    }

    // If both email and phone are unique, proceed to the next middleware
    next();
  } catch (error) {
    console.error("Error in checkEmailAndPhone middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = checkEmailAndPhone;
