const express = require("express");
const router = express.Router();
const { permissionController } = require("../../controllers");
const { Authentication, Authorization } = require("../../../middleware");
// const validate = require('../../middleware/validate')
// const authValidation = require("../../validation/auth.validation");
// const authController = require("../../controllers/auth.controller");

router.get(
  "/get-permission",
  Authentication,
  permissionController.getPermission
);
router.post(
  "/get-permission",
  permissionController.getPermission
);


module.exports = router;