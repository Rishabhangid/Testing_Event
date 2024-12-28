const express = require("express");
const { eventController } = require("../../controllers");
const router = express.Router();
const multer = require("multer");
const { Authentication, Authorization } = require("../../middlewares");
const path = require("path");
const upload = require("../../middlewares/multer");

//Save
const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); // Directory to store uploaded files

    },
    filename: function (req, file, cb) {
      console.log(file, "---------------file---------------");
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  }),
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only images (PNG, JPG) and PDFs are allowed!"));
    }
  },
}).fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
  { name: "banner", maxCount: 10 },
  { name: "profile_picture", maxCount: 1 },
]);

// const uploadMiddleware = upload.fields([
//   { name: "thumbnail", maxCount: 1 },
//   { name: "gallery", maxCount: 10 },
//   { name: "banner", maxCount: 10 },
// ]);

//View
// router.get("/event-list", Authentication, Authorization, eventController.getEvents);
router.get("/event-list",  eventController.getEvents);

router.get(
  "/event-list/:id",
  Authentication,
  Authorization,
  eventController.getEventById
);
router.get(
  "/search-event-list",
  Authentication,
  Authorization,
  eventController.searchEvents
);

router.get(
  "/package-list/:id",
  Authentication,
  // Authorization,
  eventController.getPackageInfo
)


//Create
router.post(
  "/basicinfo/create-event",
  Authentication,
  Authorization,
  eventController.addBasicInfo
);
router.patch(
  "/package/create-event/:eventId",
  Authentication,
  Authorization,
  eventController.addPackageInfo
);

router.patch(
  "/media/create-event/:eventId",
  Authentication,
  Authorization,
  uploadMiddleware,
 
  eventController.addMedia
);

router.patch(
  "/speakerlist/create-event/:eventId",
  Authentication,
  Authorization,
  uploadMiddleware,
  eventController.addSpeaker
);
router.patch(
  "/domain/create-event/:eventId",
  Authentication,
  Authorization,
  eventController.addDomainInfo
);
router.patch(
  "/social/create-event/:eventId",
  Authentication,
  Authorization,
  eventController.addSocial
);
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
//Delete

module.exports = router;
