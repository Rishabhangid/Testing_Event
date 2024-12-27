const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { eventService } = require("../service");
const passport = require("passport");
const { password } = require("../validation/custom.validation");


const getEvents = async (req, res) => {
  console.log(req.body, "---------------req---------------");
  try {
    const getHotels = await eventService.getEvents();
    res.json({ success: true, events: getHotels });
  } catch (error) {
    console.log(error, "---------------error---------------");
    res.status(500).json({ success: false, message: "new Server Error" });
  }
}

const addBasicInfo = catchAsync(async (req, res) => {
  const { created, addbasicInfo } = await eventService.addBasicInfo(req.body);
  console.log(addbasicInfo, "---------------addBasicInfo---------------");
  if (created) {
    res.status(201).send({ data: addbasicInfo, message: "Basic Information Saved Successfully!" });
  } else {
    res.status(200).send({ data: addbasicInfo, message: "Existing Hotel Details!", success: true });
  }
});


const addPackageInfo = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  const packages = req.body;
  // console.log(packages)
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
const getPackageInfo = catchAsync(async (req, res) => {
  const { id } = req.params;
 
  console.log( req.params,"eventIdeventIdeventIdeventIdeventId")
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


const addMedia = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const thumbnail = req.files.thumbnail; // Assuming the thumbnail is a single file

    // Extract gallery files from req.files array
    const gallery = req.files.gallery.filter(file => file.fieldname.startsWith('gallery'));
    const banners = req.files.banner.filter(file => file.fieldname.startsWith('banner'));
    const video_link = req.body.video_link //coming in arrey
    // Call the service to handle the addition of media
    const result = await eventService.addMedia({ eventId, thumbnail, gallery, banners, video_link });

    // Respond with the result
    res.status(201).json(result);
  } catch (error) {
    console.error("Error in addMedia controller:", error);
    next(error);
  }
};


const addSpeaker = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  const speakerData = req.body;
  const profile_picture = req.files.profile_picture; 
  try {
    const { data, statusCode } = await eventService.addSpeaker(eventId, speakerData, profile_picture);
    console.log(data,statusCode, "---------------data---------------");
    res.status(statusCode).json({
      success: true,
      data,
      message: `Property Rules Info ${statusCode === 200 ? 'Saved' : 'Already Up to Date'} Successfully!`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


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
const addSocial = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  const facilities = req.body.facilities;
  try {
    const { hotel, statusCode } = await eventService.addSocial(eventId, facilities);
    res.status(statusCode).json({
      success: true,
      hotel: hotel,
      message: `Facilities Info ${statusCode === 200 ? 'Added' : 'Already Up to Date'} Successfully!`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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
  getPackageInfo
};


