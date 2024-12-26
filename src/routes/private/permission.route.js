const express = require("express");
const router = express.Router();
const { permissionController } = require("../../controllers");
const { Authentication, Authorization } = require("../../middlewares");


router.get(
  "/get-permission",
  Authentication,
  permissionController.getPermission
);
router.post(
  "/create-permission",
  permissionController.createPermission
);


module.exports = router;