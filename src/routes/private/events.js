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
      if (file.fieldname === "thumbnail") {
        cb(null, path.join("src/uploads/Thumbnail/"));
      }
      else if (file.fieldname === "gallery") {
        cb(null, "src/uploads/Gallery/");
      }
      else if (file.fieldname === "banner") {
        cb(null, "src/uploads/Banner/");
      }
      else if (file.fieldname === "files") {
        cb(null, "src/uploads/Files/");
      }
      else if (file.fieldname === "sponsors") {
        cb(null, path.join("src/uploads/Sponsors/"));
      }
      else if (file.fieldname === "exhibitors") {
        cb(null, "src/uploads/Exhibitors/");
      }
      else {
        cb(null, "src/uploads/");
        // cb(new Error("Unsupported file field"));
      }

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
  { name: "profile_picture", maxCount: 10 },
  { name: "sponsors", maxCount: 10 },
  { name: "exhibitors", maxCount: 10 },
]);



//View
// router.get("/event-list", Authentication, Authorization, eventController.getEvents);
router.get("/event-list", eventController.getEvents);

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


//Create 1
router.post(
  "/basicinfo/create-event",
  Authentication,
  Authorization,
  eventController.addBasicInfo
);
// Creta New Added
router.patch(
  "/pitch/create-event/:eventId",
  Authentication,
  Authorization,
  eventController.addPitchInfo
);

//  ADDING SPONSORS AND EXIBITORS
// Multer for sponsors
// const sponsorsStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     if (file.fieldname === "sponsors") {
//       cb(null, path.join("src/uploads/Sponsors/"));
//     }
//     else if (file.fieldname === "exhibitors") {
//       cb(null, "src/uploads/Exhibitors/");
//     }
//     cb(null, 'src/uploads/'); // You can specify the folder here
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); // Make file name unique
//   }
// });
// const uploadSponsors = multer({ storage: sponsorsStorage });
router.patch(
  "/add-exhibitors-sponsors/create-event/:eventId",
  Authentication,
  Authorization,
  // uploadSponsors
  // .fields([{ name: 'exhibitors', maxCount: 10 }, { name: 'sponsors', maxCount: 10 } ]),
  uploadMiddleware,
  eventController.addExhibitorsAndSponsors
);



// Create 2
router.patch(
  "/package/create-event/:eventId",
  Authentication,
  Authorization,
  eventController.addPitchInfo
);


// Create 3
router.patch(
  "/media/create-event/:eventId",
  Authentication,
  Authorization,
  uploadMiddleware,
  eventController.addMedia
);





// Create 4
router.patch(
  "/speakerlist/create-event/:eventId",
  Authentication,
  Authorization,
  uploadMiddleware,
  eventController.addSpeaker
);





// Create 5
router.patch(
  "/domain/create-event/:eventId",
  Authentication,
  Authorization,
  eventController.addDomainInfo
);
// Create 6
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
