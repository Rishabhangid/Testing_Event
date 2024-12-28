const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require('path');
const { eventTypeController } = require("../../controllers");
const { Authentication, Authorization } = require("../../middlewares");

// Multer Confrigutiono
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



// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Define destination folders dynamically based on the field name
//     const fieldname = file.fieldname;

//     // Map fieldnames to folders
//     const folderMap = {
//       pictures: "uploads/eventBookings/",
//       customer_picture: "uploads/eventDetails/",
//     };

//     // Fallback to a default folder if fieldname is not in the map
//     const folder = folderMap[fieldname] || "uploads/qrCode/";
//     cb(null, folder);
//   },
//   filename: (req, file, cb) => {
//     // Store file with a unique name
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });


const upload = multer({ storage: storage });

// old
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//       cb(null, 'uploads/'); // Directory where files will be stored
//   },
//   filename: function (req, file, cb) {
//       cb(null, Date.now() + path.extname(file.originalname)); // File name format (current timestamp + original file extension)
//   }
// });

// Register Customer
// router.post(
//   "/register-customer",
//   eventTypeController.registerCustomer
// );

// // Login Customer
// router.post(
//   "/login-customer",
//   eventTypeController.loginCustomer
// );







// GET: Retrieve all event types
router.get("/event-type", eventTypeController.getEventType);


// POST: Create a new event type
router.post(
  "/create-event-type",
  Authentication,
  Authorization,
  eventTypeController.createEventType
);

// POST: Update an existing event type
router.patch(
  "/update-event-type/:id",
  Authentication,
  // Authorization,
  eventTypeController.updateEventType
);

// POST: Delete an event type
router.post(
  "/delete-event-type",
  Authentication,
  Authorization,
  eventTypeController.deleteEventType
);

// 
router.get(
  "/get-event-type/:id",
  Authentication,
  // Authorization,
  eventTypeController.getEventTypeByID
);

// POST: Adding new booking
router.post(
  "/addbooking",
  upload.any("pictures", 10),
  eventTypeController.eventBooking
);

// GET:  
router.get(
  "/showdetails/:id",
  eventTypeController.showUserData
);

router.put(
  "/updateentry/:id",
  eventTypeController.updateEntry
);

router.post(
  "/eventdetails",
  upload.single("customer_picture"),
  eventTypeController.eventDetails
);




router.post("/test", (req, res) => {
  res.json({ message: "Route is working!" });
});



// router.post("/eventdetails", eventTypeController.eventBooking)





module.exports = router;



// guaa uxtq nlhe oepg
// rishabhjangidideareality@gmail.com 


