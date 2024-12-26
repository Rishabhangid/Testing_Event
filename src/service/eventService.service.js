const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const { Event, VideoLink, Banners, Gallery, Thumbnail, PackageType, EventPackage, EventTickets } = require("../models");

// Service functions for Event Management

const getEvents = async () => {
  return await Event.find();
};

const createEvent = async (eventData) => {
  const event = await Event.create(eventData);
  return event;
};

const getEventById = async (id) => {
  const event = await Event.findById(id);
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
  }
  return event;
};

const addBasicInfo = async (basicInfoData) => {
  try {
    // Check if an event with the same title exists
    const existingEvent = await Event.findOne({ event_title: basicInfoData.event_title });
    if (existingEvent) {
      return { success: false, addbasicInfo: existingEvent };
    }

    // Create a new event
    const event = await Event.create(basicInfoData);
    return { created: true, addbasicInfo: event };
  } catch (error) {
    console.error("Error in addBasicInfo:", error);
    throw error;
  }
};


const addPackageInfo = async (eventId, packageData) => {
  try {
    console.log(packageData, "---------------packages---------------");

    // Find the event by ID
    let event = await EventTickets.create({...packageData,event_id:eventId})
    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
    }


    // Save the updated event
    await event.save();

    console.log(event, "---------------event---------------");
    return { created: true, event };
  } catch (error) {
    console.error("Error adding package info:", error);
    throw error;
  }
};
const getPackageInfo = async (eventId) => {
  console.log(eventId,"------");
  try {
   

    // Find the event by ID
    let event = await EventTickets.find({event_id:eventId})
    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
    }


   

    console.log(event, "---------------event---------------");
    return { created: true, event };
  } catch (error) {
    console.error("Error adding package info:", error);
    throw error;
  }
};


const addMedia = async ({ eventId, thumbnail, gallery, banners, videoLinks }) => {
  console.log(eventId, thumbnail, gallery, banners, videoLinks, "---------------eventId,thumbnail,gallery,banners,videoLinks---------------");
  try {
    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
    }

    // Save thumbnail in Thumbnail table
    if (thumbnail) {
      const newThumbnail = new Thumbnail({
        event_id: eventId,
        thumbnail_path: thumbnail.path, // Assuming file.path contains the thumbnail's location
      });
      await newThumbnail.save();
    }

    // Save gallery files in Gallery table
    if (gallery && gallery.length > 0) {
      const galleryPromises = gallery.map(file => {
        const newGallery = new Gallery({
          event_id: eventId,
          gallery_path: file.path, // Assuming file.path contains the gallery file's location
        });
        return newGallery.save();
      });
      await Promise.all(galleryPromises);
    }

    // Save banners in Banners table
    if (banners && banners.length > 0) {
      const bannersPromises = banners.map(file => {
        const newBanner = new Banners({
          event_id: eventId,
          banner_path: file.path, // Assuming file.path contains the banner file's location
        });
        return newBanner.save();
      });
      await Promise.all(bannersPromises);
    }

    // Save video links in VideoLink table
    if (videoLinks && Array.isArray(videoLinks)) {
      const videoLinkPromises = videoLinks.map(link => {
        const newVideoLink = new VideoLink({
          event_id: eventId,
          video_link: link, // Assuming video link is a string URL
        });
        return newVideoLink.save();
      });
      await Promise.all(videoLinkPromises);
    }

    return { success: true, message: "Media added successfully" };
  } catch (error) {
    console.error("Error saving media:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error saving media", error);
  }
};


const addSpeaker = async (eventId, speakerData) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
  }
  event.speakers.push(speakerData);
  await event.save();
  return { hotel: event, statusCode: httpStatus.OK };
};

const updateBasicinfo = async (id, updateData) => {
  const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedEvent) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
  }
  return updatedEvent;
};

const updatePackageInfo = async (id, packageData) => {
  const updatedEvent = await Event.findByIdAndUpdate(id, { packageInfo: packageData }, { new: true });
  if (!updatedEvent) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
  }
  return updatedEvent;
};

const updateMedia = async ({ id, thumbnail, gallery }) => {
  const updatedEvent = await Event.findByIdAndUpdate(
    id,
    {
      media: {
        thumbnail: thumbnail.path,
        gallery: gallery.map(file => file.path),
      },
    },
    { new: true }
  );

  if (!updatedEvent) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
  }
  return { success: true, media: updatedEvent.media };
};

const suggestions = async (id, suggestionData) => {
  const updatedEvent = await Event.findByIdAndUpdate(
    id,
    { $push: { suggestions: suggestionData } },
    { new: true }
  );

  if (!updatedEvent) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
  }
  return updatedEvent;
};

const getCreatePackageById = async (id) => {
  console.log(id, "Fetching Event by ID----------------");

  try {
    const event = await Event.findById(id);
    const tyype = await PackageType.findById(event.package_type);

    console.log(event,"----------------------",tyype)
    return tyype; 
  } catch (error) {
    console.error("Error fetching event:", error);
    throw new Error("Failed to fetch event");
  }
}

module.exports = {
  getEvents,
  createEvent,
  getEventById,
  addBasicInfo,
  addPackageInfo,
  addMedia,
  addSpeaker,
  updateBasicinfo,
  updatePackageInfo,
  updateMedia,
  suggestions,
  getCreatePackageById,
  getPackageInfo
};
