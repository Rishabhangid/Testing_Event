const express = require("express");
const authRoute = require("./auth.route");

const roles = require("./role.route");
const sidebarmenu = require("./sidebarMenu.route");
const permission = require("./permission.route.js");
const adminstaff = require("./adminStaffRoutes.js");
const agency = require("./agencyRoute");
const agency_staff = require("./agencyStaffRoute.js");
const package = require("./peckage.route");
const events = require("./events.js");
const currency = require("./currency.route");
const router = express.Router();

//Task: Reroute all API requests beginning with the `/v2` route to Express router in auth.route.js
router.use("/auth", authRoute);


router.use("/roles", roles);
router.use("/sidemenu", sidebarmenu);
router.use("/permission", permission);


// admin 
router.use('/admin_staff',adminstaff)
router.use('/agency',agency)
router.use('/agency_staff',agency_staff)

//Events
router.use("/events", events);

//Peckage
router.use("/package", package);

//Currency
router.use("/currency", currency);


module.exports = router;