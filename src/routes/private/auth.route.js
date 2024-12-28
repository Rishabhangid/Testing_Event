const express = require("express");
const router = express.Router();
const multer = require("multer");
const validate = require('../../middlewares/validate')
const authValidation = require("../../validation/auth.validation");
const authController = require("../../controllers/auth.controller.js");
const upload = require("../../middlewares/multer.js");
const { checkEmailAndPhone, Authentication } = require("../../middlewares/index.js");



//Admin,Admin Staff,Agency,Agency-Staff
router.post(
  "/register",
  upload.single("profile_picture"),
  checkEmailAndPhone,
  validate(authValidation.register),
  authController.register
);

// Admin , Staff.... Login
router.post("/login", authController.login);

//Customer Register
router.post("/register-customer", authController.registerCustomer);

// Customer Login
router.post("/login-customer", authController.loginCustomer);

// Fetching User Info By Token
router.get("/userinfo", Authentication, authController.get_userInfo_token);

// Logout Admin.....
router.post("/logout", authController.logout);


module.exports = router;