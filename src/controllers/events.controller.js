const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { eventService } = require("../service");
const passport = require("passport");
const { password } = require("../validation/custom.validation");
const Exhibitor = require("../models/exhibitorSchema");
const Sponsor = require("../models/sponsorsSchema");


// 1. Create Event : Basic Information : /v1/auth/events/basicinfo/create-event [POST]
const addBasicInfo = catchAsync(async (req, res) => {
  const { created, addbasicInfo } = await eventService.addBasicInfo(req.body);
  console.log(addbasicInfo, "---------------addBasicInfo---------------");
  if (created) {
    res.status(201).send({ data: addbasicInfo, message: "Basic Information Saved Successfully!" });
  } else {
    res.status(200).send({ data: addbasicInfo, message: "Existing Hotel Details!", success: true });
  }
});

// 2. Create Event : Adding Pitches : /v1/auth/events/pitch/create-event/:eventId [PATCH]
const addPitchInfo = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  const pitches = req.body;
  console.log("Event ID and Pitches: ", eventId, pitches);
  try {
    const { created, event } = await eventService.addPitchInformation(eventId, pitches);
    console.log(event, "---------------package---------------");
    res.status(200).json({
      success: true,
      data: event,
      message: `Pitches added successfully!`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
    console.log(error, "---------------error---------------");
  }
});

// 3. Create Event : Adding sponsors and exhibitors images : /v1/auth/events/add-exhibitors-sponsors/create-event/eventId [PATCH]
const addExhibitorsAndSponsors = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { exhibitors, sponsors } = req.files;

    if (!Array.isArray(exhibitors) || !Array.isArray(sponsors)) {
      return res.status(400).json({ message: "Exhibitors and Sponsors must be arrays." });
    }

    // Saving Exhibitors and Sponsors
    const newExhibitors = await Exhibitor.insertMany(exhibitors.map(image => ({ event_id: eventId, image: image.filename })));
    const newSponsors = await Sponsor.insertMany(sponsors.map(image => ({ event_id: eventId, pictures: image.filename })));
    // console.log(newSponsors, newExhibitors, "---------------newSponsors,newExhibitors---------------");

    res.status(201).json({
      message: "Exhibitors and Sponsors added successfully",
      exhibitors: newExhibitors,
      sponsors: newSponsors,
    });
  } catch (error) {
    res.status(500).json({ message: "Error saving exhibitors and sponsors", error });
  }
};

// 4. Create Event : Adding Package Info : /v1/auth/events/package/create-event/eventId [PATCH]
const addPackageInfo = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  const packages = req.body;
  console.log(eventId, packages, "---------------eventId, packages---------------");
  try {
    const { created, event } = await eventService.addPackageInfo(eventId, packages);
    console.log(event, "---------------package---------------");
    res.status(200).json({
      success: true,
      data: event,
      message: `Package created successfully!`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
    console.log(error, "---------------error---------------");
  }
});

// 5. Create Event : Adding Documents, Gallary ,Banners :/v1/auth/events/media/create-event/eventId [PATCH]
// const addMedia = async (req, res, next) => {
//   try {
//     const { eventId } = req.params;
//     const thumbnail = req.files.thumbnail;

//     // Extract gallery, banners, video link and documents from req.files array
//     const gallery = req.files.gallery?.filter(file => file.fieldname.startsWith('gallery'));
//     const banners = req.files.banner?.filter(file => file.fieldname.startsWith('banner'));
//     const document = req.files.documents?.filter(file => file.fieldname.startsWith('documents'));
//     console.log(document, "---------------document---------------");
//     const video_link = req.body.video_link //coming in array

//     // Call the service to handle the addition of media
//     const result = await eventService.addMedia({ eventId, thumbnail, gallery, banners, video_link, document });

//     res.status(201).json(result);
//   } catch (error) {
//     console.error("Error in addMedia controller:", error);
//     next(error);
//   }
// };
const addMedia = async (req, res, next) => {
  console.log(req.files, "---------------req.files---------------");
  try {
    const { eventId } = req.params;

    // Extract files from req.files
    const thumbnail = req.files.thumbnail?.[0]; // Single file
    const gallery = req.files.gallery || []; // Array of files
    const banners = req.files.banner || []; // Array of files
    const documents = req.files.document || []; // Array of files

    // Extract video links from req.body
    // const video_links = JSON.parse(req.body.video_link || "[]");
    const video_links = req.body.video_link;
    console.log(documents, "---------------documets---------------");

    // Call the service to handle media addition
    const result = await eventService.addMedia({
      eventId,
      thumbnail,
      gallery,
      banners,
      video_links,
      documents,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Error in addMedia controller:", error);
    next(error);
  }
};


// 6. Create Event : Adding Speakers : /v1/auth/events/speakerlist/create-event/:eventId [PATCH]
const addSpeaker = catchAsync(async (req, res) => {
  console.log("hy")
  const { eventId } = req.params;
  const parsedSpeakerData = [];
  if (req.body.name && req.body.designation) {
    for (let i = 0; i < req.body.name.length; i++) {
      parsedSpeakerData.push({
        name: req.body.name[i],
        designation: req.body.designation[i],
      });
    }
  }
  // console.log("parsed", parsedSpeakerData,)
  const { speakerData } = req.body
  const { profile_picture } = req.files;
  // console.log(req.files, "---------------profile_pictures---------------");
  // console.log(req.body, "---------------speakerData---------------");


  try {
    const { data, statusCode } = await eventService.addSpeaker(eventId, parsedSpeakerData, req.files);
    // console.log(data, statusCode, "---------------data---------------");
    res.status(statusCode).json({
      success: true,
      data,
      message: `Speakers ${statusCode === 200 ? 'Added' : 'Already Up to Date'} Successfully!`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. Create Event : Add Domain Info : 
const addDomainInfo = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  const facilities = req.body.facilities;
  try {
    const { hotel, statusCode } = await eventService.addDomainInfo(eventId, facilities);
    res.status(statusCode).json({
      success: true,
      hotel: hotel,
      message: `Facilities Info ${statusCode === 200 ? 'Added' : 'Already Up to Date'} Successfully!`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 8. Create Event : Add Social Media Links : /v1/auth/events/social/create-event/:eventId [PATCH]
const addSocial = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  const links = req.body;
  console.log("socials", links)
  try {
    const { hotel, statusCode } = await eventService.addSocial(eventId, links);
    res.status(statusCode).json({
      success: true,
      hotel: hotel,
      message: `Social Medial Links ${statusCode === 200 ? 'Added' : 'Already Up to Date'} Successfully!`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 9. Update Event Status : Add Social Media Links : /v1/auth/events/social/create-event/:eventId [PATCH]
const updateEventStatus = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  console.log(eventId, "---------------event Id---------------");
  const new_status = req.body;
  console.log("socials", new_status)
  try {
    const changeStatus = await eventService.updateEvent(eventId);

    if (!changeStatus) {
      return res.status(404).json({ success: false, message: "Status not updated." });
    }

    return res.status(200).json({
      success: true,
      message: "Event Status changed successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error in during status changeing User.", success: true });
  }


});



const getEvents = async (req, res) => {
  console.log(req.body, "---------------req---------------");
  try {
    const getHotels = await eventService.getEvents();
    console.log(getHotels, "---------------getHotels---------------");
    res.json({ success: true, events: getHotels });
  } catch (error) {
    console.log(error, "---------------error---------------");
    res.status(500).json({ success: false, message: "new Server Error" });
  }
}

const getEventsAdmin = async (req, res) => {
  console.log(req.body, "---------------req---------------");
  try {
    const getHotels = await eventService.getEventsAdmin();
    console.log(getHotels, "---------------getHotels---------------");
    res.json({ success: true, events: getHotels });
  } catch (error) {
    console.log(error, "---------------error---------------");
    res.status(500).json({ success: false, message: "new Server Error" });
  }
}



const getPackageInfo = catchAsync(async (req, res) => {
  const { id } = req.params;


  console.log(req.params, "eventIdeventIdeventIdeventIdeventId")
  try {
    const { created, event } = await eventService.getPackageInfo(id);
    console.log(event, "---------------package---------------");
    res.status(200).json({
      success: true,
      data: event,
      message: `Package get successfully!`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
    console.log(error, "---------------error---------------");
  }
});

























const createEvent = catchAsync(async (req, res) => {
  const hotel = await eventService.createEvent(req.body);
  res.status(httpStatus.CREATED).send({ hotel });
});

const getEventById = async (req, res) => {
  const { city } = req.body; // Assuming the ID is passed in the URL parameters
  const { id } = req.params
  try {
    const hotel = await eventService.getEventById(id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: "Hotel not found" });
    }
    res.json({ success: true, hotel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const searchEvents = async (req, res) => {
  const { location, to_date, from_date, guest, room_count } = req.body;
  console.log(location, to_date, from_date, guest, room_count, "-----------====================");
  try {
    const hotel = await eventService.searchEvents(
      location.toLowerCase(),
      to_date,
      from_date,
      guest,
      room_count
    );
    if (!hotel) {
      return res.status(404).json({ success: false, message: "Hotel not found" });
    }
    res.status(200).json({ success: true, data: hotel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update existing hotel basic info by ID
const updateBasicinfo = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  console.log(updateData, "-------------updatedHotel-----------")

  try {
    const updatedHotel = await eventService.updateBasicinfo(id, updateData);
    res.json({ success: true, updatedHotel });
  } catch (error) {
    console.error('Error updating hotel basic info:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Update location information by ID
const updatePackageInfo = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedHotel = await eventService.updatePackageInfo(id, updateData);
    res.json({ success: true, updatedHotel });
  } catch (error) {
    console.error('Error updating hotel location info:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Update media for a specific hotel by ID
const updateMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { thumbnail, gallery } = req.files;

    // Call the service to handle the media update
    const result = await eventService.updateMedia({ id, thumbnail, gallery });

    // Respond with the result
    res.json(result);
  } catch (error) {
    console.error("Error in updateMedia controller:", error);
    next(error);
  }
};

const updateSpeakerInfo = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedInfo = await eventService.updateSpeakerInfo(id, updateData);
    res.json({ success: true, updatedInfo });
  } catch (error) {
    console.error('Error updating property rules info:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

// Update hotel facilities for a specific hotel by ID
const updateDomain = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedFacilities = await eventService.updateDomain(id, updateData);
    res.json({ success: true, updatedFacilities });
  } catch (error) {
    console.error('Error updating hotel facilities:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
const suggestions = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedFacilities = await eventService.suggestions(id, updateData);
    res.json({ success: true, updatedFacilities });
  } catch (error) {
    console.error('Error updating hotel facilities:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
const updateSocial = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedFacilities = await eventService.updateSocial(id, updateData);
    res.json({ success: true, updatedFacilities });
  } catch (error) {
    console.error('Error updating hotel facilities:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



const getCreatedPackagelistbyEventId = async (req, res) => {
  const { id } = req.params;
  console.log(id, "Request ID---------------------------");

  try {
    const event = await eventService.getCreatePackageById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.error("Error fetching package list:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



module.exports = {
  createEvent,
  addBasicInfo,
  addPackageInfo,
  addMedia,
  addSpeaker,
  addDomainInfo,
  getEvents,
  addSocial,
  getEventById,
  updateBasicinfo,
  updateSpeakerInfo,
  updateMedia,
  updateDomain,
  updateSocial,
  searchEvents,
  suggestions,
  updatePackageInfo,
  getCreatedPackagelistbyEventId,
  getPackageInfo,
  addPitchInfo,
  addExhibitorsAndSponsors,
  updateEventStatus,
  getEventsAdmin
};


