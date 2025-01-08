const express = require("express");
const { eventController } = require("../../controllers");
const router = express.Router();
const multer = require("multer");
const { Authentication, Authorization } = require("../../middlewares");
const path = require("path");
const upload = require("../../middlewares/multer");

//Save Files
// const uploadMiddleware = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, cb) {
//       if (file.fieldname === "thumbnail") {
//         cb(null, path.join("src/uploads/Thumbnail/"));
//       }
//       else if (file.fieldname === "gallery") {
//         cb(null, "src/uploads/Gallery/");
//       }
//       else if (file.fieldname === "banner") {
//         cb(null, "src/uploads/Banner/");
//       }
//       else if (file.fieldname === "files") {
//         cb(null, "src/uploads/Files/");
//       }
//       else if (file.fieldname === "sponsors") {
//         cb(null, path.join("src/uploads/Sponsors/"));
//       }
//       else if (file.fieldname === "documents") {
//         cb(null, path.join("src/uploads/Documents/"));
//       }
//       else if (file.fieldname === "profile_picture") {
//         cb(null, path.join("src/uploads/Profile_Picture/"));
//       }
//       else if (file.fieldname === "exhibitors") {
//         cb(null, "src/uploads/Exhibitors/");
//       }
//       else {
//         cb(null, "src/uploads/");
//         // cb(new Error("Unsupported file field"));
//       }

//     },
//     filename: function (req, file, cb) {
//       console.log(file, "---------------file---------------");
//       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//       cb(null, uniqueSuffix + "-" + file.originalname);
//     },
//   }),
//   fileFilter: function (req, file, cb) {
//     const allowedTypes = /jpeg|jpg|png|pdf/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (extname && mimetype) {
//       return cb(null, true);
//     } else {
//       cb(new Error("Only images (PNG, JPG) and PDFs are allowed!"));
//     }
//   },
// }).fields([
//   { name: "thumbnail", maxCount: 1 },
//   { name: "gallery", maxCount: 10 },
//   { name: "banner", maxCount: 10 },
//   { name: "profile_picture", maxCount: 10 },
//   { name: "sponsors", maxCount: 10 },
//   { name: "exhibitors", maxCount: 10 },
//   { name: "documents", maxCount: 3 },
// ]);


const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const destinations = {
        thumbnail: "src/uploads/Thumbnail/",
        gallery: "src/uploads/Gallery/",
        banner: "src/uploads/Banner/",
        documents: "src/uploads/Documents/",
        // Add other cases if needed
      };
      cb(null, destinations[file.fieldname] || "src/uploads/");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  }),
  fileFilter: function (req, file, cb) {
    // const allowedTypes = /jpeg|jpg|png|pdf/;
    // const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    // const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images (PNG, JPG) and PDFs are allowed!"));
    }
  },
}).fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
  { name: "banner", maxCount: 10 },
  { name: "document", maxCount: 3 },
]);


// Fetching All Events [ PUBLIC ]
router.get("/event-list", eventController.getEvents);

// Fetching All Events [ ADMIN ]
router.get("/event-admin", eventController.getEventsAdmin);

// Fetching Single Event By Id
router.get("/event-list/:id", Authentication, Authorization, eventController.getEventById);

// Searching Event
router.get("/search-event-list", Authentication, Authorization, eventController.searchEvents);

// Fetching Package Information
router.get("/package-list/:id", Authentication, eventController.getPackageInfo)

// 1. Create Event ( Adding Basic Info )
router.post("/basicinfo/create-event", Authentication, Authorization, eventController.addBasicInfo);

// 2. Create Event ( Adding Pitches )
router.patch("/pitch/create-event/:eventId", Authentication, Authorization, eventController.addPitchInfo);

// 3. Create Event ( Adding Sponsor and Exibitor Images )
router.patch( "/add-exhibitors-sponsors/create-event/:eventId", Authentication, Authorization, uploadMiddleware, eventController.addExhibitorsAndSponsors);

// 4. Create Event ( Adding Packages )
router.patch("/package/create-event/:eventId", Authentication, Authorization, eventController.addPackageInfo);

// 5. Create Event ( Adding Media Events )
router.patch("/media/create-event/:eventId", Authentication, Authorization, uploadMiddleware, eventController.addMedia);

// 6. Create Event ( Add Speakers )
router.patch("/speakerlist/create-event/:eventId", Authentication, Authorization, uploadMiddleware, eventController.addSpeaker);

// 7. Create Event ( Add Domain )
router.patch("/domain/create-event/:eventId", Authentication, Authorization, eventController.addDomainInfo);

// 8. Create Event ( Add Social Media Links )
router.patch("/social/create-event/:eventId", Authentication, Authorization, eventController.addSocial);

// 9. Update Event Status ( Using to Show Event which wanna to show )
router.get("/updatestatus/create-event/:eventId", Authentication, Authorization, eventController.updateEventStatus);

//Update
router.put(
  "/basicinfo/edit-event/:id",
  Authentication,
  Authorization,
  eventController.updateBasicinfo
);
router.put(
  "/packege/edit-event/:id",
  Authentication,
  Authorization,
  eventController.updatePackageInfo
);
router.put(
  "/media/edit-event/:id",
  Authentication,
  Authorization,
  uploadMiddleware,
  eventController.updateMedia
);
router.put(
  "/speakerlist/edit-event/:id",
  Authentication,
  Authorization,
  eventController.updateSpeakerInfo
);
router.put(
  "/domain/edit-event/:id",
  Authentication,
  Authorization,
  eventController.updateDomain
);
router.put(
  "/social/edit-event/:id",
  Authentication,
  Authorization,
  eventController.updateSocial
);


module.exports = router;
