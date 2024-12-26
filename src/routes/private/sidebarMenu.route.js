const express = require("express");
const router = express.Router();
// const validate = require('../../middleware/validate')
// const authValidation = require("../../validation/auth.validation");
// const authController = require("../../controllers/auth.controller");
const sidebarMenuController = require("../../controllers/sidebarMenu.controller");
const { Authentication, Authorization } = require("../../middlewares");



router.get(
  "/sidebar-menus",
  Authentication,
  Authorization,
  sidebarMenuController.getSidebarMenus
);

router.get(
  "/sidebar-menu",
  sidebarMenuController.getAllSidebarMenus
);

module.exports = router;


