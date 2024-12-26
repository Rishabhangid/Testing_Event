const express = require("express");
const router = express.Router();
const { roleController } = require("../../controllers");
const { Authentication, Authorization } = require("../../middlewares");



router.get(
  "/roles-list",
  Authentication,
  Authorization,
  roleController.getRoles
);
router.get(
  "/view-role/:id",
  Authentication,
  Authorization,
  roleController.getRoleById
);
router.patch(
  "/update-role/:id",
  Authentication,
  Authorization,
  roleController.updatRoleById
);
router.post(
  "/create-role",
  Authentication,
  Authorization,
  roleController.createRole
);
router.delete(
  "/delete-role/:id",
  Authentication,
  Authorization,
  roleController.deleteRole
);


module.exports = router;
