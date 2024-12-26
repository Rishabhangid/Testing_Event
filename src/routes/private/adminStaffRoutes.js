
const express = require("express");
const {
  createAdminStaff,
  getAllAdminStaff,
  getAdminStaffById,
  updateAdminStaff,
  deleteAdminStaff,
} = require("../../controllers/adminStaff.controller");
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
  "/create-admin-staff",
  Authentication,
  Authorization,
  uploadMiddleware,
  checkEmailAndPhone,
  validate(authValidation.register),
  createAdminStaff
);

router.get("/get-admin-staff", Authentication, Authorization, getAllAdminStaff);
router.get(
  "/get-admin-staff/:id",
  Authentication,
  Authorization,
  getAdminStaffById
);
router.patch(
  "/update-admin-staff/:id",
  Authentication,
  Authorization,
  uploadMiddleware,
  updateAdminStaff
);
router.delete(
  "/delete-admin-staff/:id",
  Authentication,
  Authorization,
  deleteAdminStaff
);

module.exports = router;
