const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const { Event, VideoLink, Banners, Gallery, Thumbnail, PackageType, EventPackage, EventTickets, SpeakerSchema } = require("../models");
const Document = require("../models/eventDocument.model");

// Service functions for Event Management

const getEvents = async () => {
  return await Event.find({status: true});
};

const getEventsAdmin = async () => {
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

// 1. Create Event: Adding Basic Information
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
    // console.error("Error in addBasicInfo:", error);
    throw error;
  }
};

// 2.Create Event : Add Pitches
const addPitchInformation = async (eventId, pitches) => {
  try {
    // console.log("Piches from Service", pitches);
    // console.log("Event ID from Service", eventId);

    // Find the event by ID
    let event = await Event.findByIdAndUpdate({ _id: eventId }, { program_details: pitches.program_details, exhibitor_and_participants: pitches.exhibitor_and_participants }, { new: true, runValidators: true })
    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
    }
    // console.log(event, "---------------event---------------");
    return { created: true, event };
  } catch (error) {
    // console.error("Error adding package info:", error);
    throw error;
  }
};

// 3. Create Event : In Controller

// 4. Create Event : Add Packages
const addPackageInfo = async (eventId, packageData) => {
  try {
    // console.log(packageData, eventId, "---------------from service---------------");

    // Find the event by ID
    let event = await Event.findByIdAndUpdate(eventId, { $set: packageData }, { new: true, runValidators: true })
    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
    }
    // console.log(event, "---------------event---------------");
    return { created: true, event };
  } catch (error) {
    console.error("Error adding package info:", error);
    throw error;
  }
};

// 5. Create Event : Adding Media
// const addMedia = async ({ eventId, thumbnail, gallery, banners, video_link, document }) => {
//   try {
//     if (!eventId) {
//       throw new ApiError(httpStatus.BAD_REQUEST, "Event ID is required");
//     }

//     // Check if the event exists
//     const event = await Event.findById(eventId);
//     if (!event) {
//       throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
//     }

//     // console.log("Gallery", gallery)
//     // console.log("Banners", banners)
//     // console.log("Documents", document)
//     // console.log("Thumbmil", thumbnail)
//     // console.log("Video Links", video_link)

//     // Save thumbnail in Thumbnail table
//     if (thumbnail) {
//       if (!Array.isArray(thumbnail) || thumbnail.length === 0) {
//         throw new ApiError(httpStatus.BAD_REQUEST, "Invalid thumbnail file");
//       }
//       const newThumbnail = await Event.findByIdAndUpdate(eventId, { $set: { thumbnail_path: thumbnail[0].filename } }, { new: true, runValidators: true })
//     }

//     // Save gallery files in Gallery table
//     if (gallery && gallery.length > 0) {
//       const invalidGalleryFiles = gallery.filter(file => !file.filename);
//       if (invalidGalleryFiles.length > 0) {
//         throw new ApiError(httpStatus.BAD_REQUEST, "Some gallery files are invalid");
//       }

//       const galleryPromises = gallery.map(file => {
//         const newGallery = new Gallery({ event_id: eventId, gallery_path: file.filename });
//         return newGallery.save();
//       });
//       await Promise.all(galleryPromises);
//     }

//     // Saving banners in Banners table
//     if (banners && banners.length > 0) {
//       const invalidBannerFiles = banners.filter(file => !file.filename);
//       if (invalidBannerFiles.length > 0) {
//         throw new ApiError(httpStatus.BAD_REQUEST, "Some banner files are invalid");
//       }

//       const bannersPromises = banners.map(file => {
//         const newBanner = new Banners({ event_id: eventId, banner_path: file.filename });
//         return newBanner.save();
//       });
//       await Promise.all(bannersPromises);
//     }

//     // Save video links in VideoLink table
//     if (video_link && Array.isArray(video_link)) {
//       const invalidVideoLinks = video_link.filter(link => typeof link !== "string" || !link.trim());
//       if (invalidVideoLinks.length > 0) {
//         throw new ApiError(httpStatus.BAD_REQUEST, "Some video links are invalid");
//       }

//       const videoLinkPromises = video_link.map(link => {
//         const newVideoLink = new VideoLink({ event_id: eventId, video_link: link });
//         return newVideoLink.save();
//       });
//       await Promise.all(videoLinkPromises);
//     }

//     // Saving Documnets in Documents table
//     if (document && Array.isArray(document)) {
//       // Extract the `path` property from each file object
//       const documentPaths = document.map(file => file.path);

//       // Validate the extracted paths
//       const invalidDocumentLinks = documentPaths.filter(link => typeof link !== "string" || !link.trim());
//       if (invalidDocumentLinks.length > 0) {
//         console.error("Invalid document links:", invalidDocumentLinks);
//         throw new ApiError(httpStatus.BAD_REQUEST, "Some Documents are invalid");
//       }

//       // Save valid document paths to the database
//       const documentPromises = documentPaths.map(link => {
//         const newDocument = new Document({ event_id: eventId, document: link });
//         return newDocument.save();
//       });

//       await Promise.all(documentPromises);
//     }

//     return { success: true, message: "Media added successfully" };
//   } catch (error) {
//     console.error("Error saving media:", error);
//     if (error instanceof ApiError) {
//       throw error; // Will be handled by global error middleware
//     }
//     // Return a generic error message if the error is not an ApiError
//     throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
//   }
// };
const addMedia = async ({ eventId, thumbnail, gallery, banners, video_links, documents }) => {
  console.log( documents, "---------------documents---------------");
  try {
    if (!eventId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Event ID is required");
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
    }

    // Save thumbnail
    if (thumbnail) {
      const thumbnailPath = thumbnail.filename;
      console.log(thumbnailPath, "---------------thumbnailPath *********---------------");
      await Event.findByIdAndUpdate(eventId, { $set: { thumbnail_path: thumbnailPath } });
    }

    // Save gallery
    if (gallery.length > 0) {
      const galleryEntries = gallery.map(file => ({
        event_id: eventId,
        gallery_path: file.filename,
      }));
      await Gallery.insertMany(galleryEntries);
    }

    // Save banners
    if (banners.length > 0) {
      const bannerEntries = banners.map(file => ({
        event_id: eventId,
        banner_path: file.filename,
      }));
      await Banners.insertMany(bannerEntries);
    }

    // Save video links
    if (Array.isArray(video_links) && video_links.length > 0) {
      const videoLinkEntries = video_links.map(link => ({
        event_id: eventId,
        video_link: link,
      }));
      await VideoLink.insertMany(videoLinkEntries);
    }

    // Save documents
    if (documents.length > 0) {
      const documentEntries = documents.map(file => ({
        event_id: eventId,
        document: file.filename,
      }));
      console.log(documentEntries, "---------------documentEntries---------------");
      await Document.insertMany(documentEntries);
    }

    return { success: true, message: "Media added successfully" };
  } catch (error) {
    console.error("Error in addMedia service:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to add media");
  }
};


// 6. Create Event : Adding Speakers
const addSpeaker = async (eventId, speakerData, profile_pictures) => {
  const event = await Event.findById(eventId);
  // console.log(speakerData, "---------------speakerData---------------");
  // console.log(profile_pictures, "---------------profile_pictures---------------");

  if (!event) throw new ApiError(httpStatus.NOT_FOUND, "Event not found");

  // Ensure speakerData is an array
  if (!Array.isArray(speakerData)) {
    speakerData = typeof speakerData === "object" ? Object.values(speakerData) : [];
  }

  // Extract actual profile pictures array if nested
  profile_pictures = profile_pictures?.profile_picture || [];

  // Validate speakerData and profile_pictures length
  if (!profile_pictures || profile_pictures.length !== speakerData.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Each speaker must have a corresponding profile picture");
  }

  try {
    const speakers = await Promise.all(
      speakerData.map(async (data, index) => {
        const { name, designation } = data;
        const profile_picture = profile_pictures[index].filename;

        return await SpeakerSchema.create({
          event_id: eventId,
          name,
          designation,
          profile_picture,
        });
      })
    );

    return { data: speakers, statusCode: 200 };
  } catch (error) {
    // console.error(error, "Database error");
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to add speakers");
  }
};

// 7. Create Event : Add Domain
const addDomainInfo = async (eventId, speakerData, profile_picture) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
  }
  if (!profile_picture) {
    throw new ApiError(httpStatus.NOT_FOUND, "Profile Picture not found");
  }
  try {

    const speckers = await SpeakerSchema.create({ ...speakerData, profile_picture: profile_picture[0].filename, event_id: eventId });

    return { data: speckers, statusCode: 200 };
  } catch (error) {
    console.error(error, "---------------error---------------");
    return { data: [], statusCode: 500 };
  }
};

// 8. Create Event : Add Social Media Links
const addSocial = async (eventId, links) => {
  const event = await Event.findById(eventId);
  console.log(links.facebook, "---------------links---------------");

  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
  }
  if (!links) {
    throw new ApiError(httpStatus.NOT_FOUND, "Profile Picture not found");
  }
  try {

    const speckers = await Event.findByIdAndUpdate({ _id: eventId }, { $set: { website_link: links.website_link || "", facebook: links.facebook, twitter: links.twitter, youtube: links.youtuber, linkedin: links.linkedin, instagram: links.instagram } }, { new: true }, { runValidators: true });
    await speckers.save();
    return { data: speckers, statusCode: 200 };
  } catch (error) {
    console.error(error, "---------------error---------------");
    return { data: [], statusCode: 500 };
  }
};

// 9. Create Event : Add Social Media Links
const updateEvents = async (eventId, new_status) => {
  const event = await Event.findById(eventId);
  const booleanStatus = new_status.status;
  console.log(booleanStatus, "---------------links---------------");

  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
  }
  if (!new_status) {
    throw new ApiError(httpStatus.NOT_FOUND, "Status not Found");
    
  }
  try {

    // const updateStatus = await Event.findByIdAndUpdate({ _id: eventId }, { $set: {  status: new_status } }, { new: true }, { runValidators: true });
    const updateStatus = await Event.findByIdAndUpdate(
      { _id: eventId },
      { $set: { status: booleanStatus } },
      { new: true }, 
      { runValidators: true }
    );
    await updateStatus.save();
    return { data: updateStatus, statusCode: 200 };
  } catch (error) {
    console.error(error, "---------------error---------------");
    return { data: [], statusCode: 500 };
  }
};

const updateEvent = async (eventId) => {
  try {
    // Find the user by ID
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    console.log("Event Found.", event)

    // Toggle the status
    event.status = !event.status;

    // Save the updated user
    await event.save();

    return event;
  } catch (error) {
    console.error("Error toggling status:", error);
    throw error;
  }
};



const getPackageInfo = async (eventId) => {
  console.log(eventId, "------");
  try {


    // Find the event by ID
    let event = await EventTickets.find({ event_id: eventId })
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

    console.log(event, "----------------------", tyype)
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
  getPackageInfo,
  addSocial,
  addPitchInformation,
  updateEvent,
  getEventsAdmin
};


