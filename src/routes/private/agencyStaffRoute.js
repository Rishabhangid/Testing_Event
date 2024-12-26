
const express = require("express");
const {
  createAgencyStaff,
  getAllAgencyStaff,
  getAgencyStaffById,
  updateAgencyStaff,
  deleteAgencyStaff,
} = require("../../controllers/agencyStaff.controller.js");
const authValidation = require("../../validation/auth.validation");
const {
  Authentication,
  Authorization,
  checkEmailAndPhone,
} = require("../../middlewares");
const upload = require("../../middlewares/multer");
const validate = require("../../middlewares/validate");

const router = express.Router();

const uploadMiddleware = upload.fields([
  { name: "profile_picture", maxCount: 1 },
  { name: "aadhar_front", maxCount: 1 },
  { name: "aadhar_back", maxCount: 1 },
  { name: "pan_front", maxCount: 1 },
]);

router.post(
  "/create-agency-staff",
  Authentication,
  Authorization,
  uploadMiddleware,
  checkEmailAndPhone,
  validate(authValidation.register),
  createAgencyStaff
);

router.get("/get-agency-staff", Authentication, Authorization, getAllAgencyStaff);
router.get(
  "/get-agency-staff/:id",
  Authentication,
  Authorization,
  getAgencyStaffById
);
router.patch(
  "/update-agency-staff/:id",
  Authentication,
  Authorization,
  uploadMiddleware,
  updateAgencyStaff
);
router.delete(
  "/delete-agency-staff/:id",
  Authentication,
  Authorization,
  deleteAgencyStaff
);

module.exports = router;
