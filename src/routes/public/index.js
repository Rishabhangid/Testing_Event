const express = require("express");

// const imageRoute = require('./images.route');
// const publicAuth = require('./publicAuth.route')
const eventRoute = require('./event.route')
const locations = require('./locations.route.js')
// const roomRoute = require('./room.route')
// const commonRoute = require('./common.route')

const router = express.Router();

//Task: Reroute all API requests beginning with the `/v2` route to Express router in auth.route.js

// router.use("/get-Images", imageRoute);
// router.use("/auth-customer",  publicAuth);
router.use("/event",eventRoute),
router.use("/locations",locations),

// router.use("/public", commonRoute)

module.exports = router;