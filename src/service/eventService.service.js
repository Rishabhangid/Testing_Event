const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const { Event, VideoLink, Banners, Gallery, Thumbnail, PackageType, EventPackage, EventTickets, SpeakerSchema } = require("../models");

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

const addMedia = async ({ eventId, thumbnail, gallery, banners, video_link }) => {
  try {
    // Validate eventId
    if (!eventId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Event ID is required");
    }

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
    }

    console.log("---------------Gallery---------------", banners, "---------------Gallery---------------");

    // Save thumbnail in Thumbnail table
    if (thumbnail) {
      if (!Array.isArray(thumbnail) || thumbnail.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid thumbnail file");
      }

      const newThumbnail = new Thumbnail({
        event_id: eventId,
        thumbnail_path: thumbnail[0].filename, // Assuming file.filename contains the thumbnail's location
      });
      await newThumbnail.save();
    }

    // Save gallery files in Gallery table
    if (gallery && gallery.length > 0) {
      const invalidGalleryFiles = gallery.filter(file => !file.filename);
      if (invalidGalleryFiles.length > 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Some gallery files are invalid");
      }

      const galleryPromises = gallery.map(file => {
        const newGallery = new Gallery({
          event_id: eventId,
          gallery_path: file.filename, // Assuming file.filename contains the gallery file's location
        });
        return newGallery.save();
      });
      await Promise.all(galleryPromises);
    }

    // Save banners in Banners table
    if (banners && banners.length > 0) {
      const invalidBannerFiles = banners.filter(file => !file.filename);
      if (invalidBannerFiles.length > 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Some banner files are invalid");
      }

      const bannersPromises = banners.map(file => {
        const newBanner = new Banners({
          event_id: eventId,
          banner_path: file.filename, // Assuming file.filename contains the banner file's location
        });
        return newBanner.save();
      });
      await Promise.all(bannersPromises);
    }

    // Save video links in VideoLink table
    if (video_link && Array.isArray(video_link)) {
      const invalidVideoLinks = video_link.filter(link => typeof link !== "string" || !link.trim());
      if (invalidVideoLinks.length > 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Some video links are invalid");
      }

      const videoLinkPromises = video_link.map(link => {
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
    // Log error for debugging
    console.error("Error saving media:", error);

    // Check for custom ApiError and return its message
    if (error instanceof ApiError) {
      throw error; // Will be handled by global error middleware
    }

    // Return a generic error message if the error is not an ApiError
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
  }
};


const addSpeaker = async (eventId, speakerData,profile_picture) => {
  const event = await Event.findById(eventId);
 
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
  }
  if (!profile_picture) {
    throw new ApiError(httpStatus.NOT_FOUND, "Profile Picture not found");
  }
  try {
    
    const speckers= await SpeakerSchema.create({...speakerData,profile_picture:profile_picture[0].filename,event_id:eventId});

     return { data:speckers, statusCode: 200 };
  } catch (error) {
    console.error(error, "---------------error---------------");
    return { data:[], statusCode: 500 };
  }
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
