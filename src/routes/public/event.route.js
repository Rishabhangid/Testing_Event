const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require('path');
const { eventTypeController } = require("../../controllers");
const { Authentication, Authorization } = require("../../middlewares");

// Multer Confrigution
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file)
    if (file.fieldname.includes("[pictures]")) {
      cb(null, path.join("src/uploads/eventBookings/")); // You can specify any directory where images will be stored
    }
    else if (file.fieldname === "customer_picture") {
      cb(null, "src/uploads/eventDetails/"); // You can specify any directory where images will be stored
    }
    else {
      cb(null, "src/uploads/qrCode/"); // You can specify any directory where images will be stored
      // cb(new Error("Unsupported file field"));
    } // You can specify any directory where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Store file with a unique name (timestamp + original name)
  }
});
const upload = multer({ storage: storage });

// GET: Fetch All Events Detail
router.get("/event-type", eventTypeController.getEventType);

// POST: Create a new event type
router.post("/create-event-type", Authentication, Authorization, eventTypeController.createEventType);

// POST: Update an existing event type
router.patch("/update-event-type/:id", Authentication, eventTypeController.updateEventType);

// POST: Delete an event type
router.post("/delete-event-type", Authentication, Authorization, eventTypeController.deleteEventType);

// GET: Get Unique Event Detail by ID
router.get("/get-event-type/:id", Authentication, eventTypeController.getEventTypeByID);

// POST: Adding new booking
// router.post("/addbooking/:eventid", upload.any("pictures", 10), Authentication, eventTypeController.eventBooking);
router.post("/addbooking/:eventid", upload.any("pictures", 10),  eventTypeController.eventBooking);

// GET: Show User Details By ID 
router.put("/showdetails/:id/:code", eventTypeController.showUserData);

// PUT: Update Entry
router.put("/updateentry/:id", eventTypeController.updateEntry);

// POST: Adding Event Details
router.post("/eventdetails", upload.single("customer_picture"), eventTypeController.eventDetails);

// POST: Testing Route
router.post("/test", (req, res) => { res.json({ message: "Route is working!" });});

// Exporting Routes
module.exports = router;



