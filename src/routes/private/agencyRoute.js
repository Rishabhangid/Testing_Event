
const express = require("express");
const {
  createAgency,
  getAllAgency,
  getAgencyById,
  updateAgency,
  deleteAgency,
} = require("../../controllers/agency.controller.js");
const authValidation = require("../../validation/auth.validation");
const {
  Authentication,
  Authorization,
  checkEmailAndPhone,
} = require("../../middlewares");
const upload = require("../../middlewares/multer");
const { authService } = require("../../service");
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
  createAgency
);

router.get("/get-agency-staff", Authentication, Authorization, getAllAgency);
router.get(
  "/get-admin-staff/:id",
  Authentication,
  Authorization,
  getAgencyById
);
router.patch(
  "/update-agency-staff/:id",
  Authentication,
  Authorization,
  uploadMiddleware,
  updateAgency
);
router.delete(
  "/delete-agency-staff/:id",
  Authentication,
  Authorization,
  deleteAgency
);

module.exports = router;
