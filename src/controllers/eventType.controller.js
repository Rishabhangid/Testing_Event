const { EventType } = require("../models");

const EventBooking = require("../models/eventBookingSchema");
const EventDetails = require("../models/eventDetailsSchema");


// const QRCode = require('qrcode');
const QRCode = require('qrcode');
const fs = require('fs');
const EventBookingNews = require("../models/eventBookingSchemas");
// const EventBookingNew = require("../models/eventBookingSchemas");


const path = require("path"); // Import path for handling file paths
// const fs = require("fs");










// GET: Retrieve all event types
const getEventType = async (req, res) => {
  try {
    const eventTypes = await EventType.find();
    res.status(200).json(eventTypes);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve event types", error });
  }
};

// const getEventTypeByID = async (req, res) => {
//   try {
//     const eventTypes = await EventType.findById(req.params.id);
//     res.status(200).json(eventTypes);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to retrieve event types", error });
//   }
// };

// POST: Create a new event type
const createEventType = async (req, res) => {
  try {
    const { type, description } = req.body;
    console.log(req.body, "---------------req.body---------------");
    // Check if event type already exists
    const existingEventType = await EventType.findOne({ type });
    if (existingEventType) {
      return res.status(400).json({ message: "Event type already exists" });
    }

    const newEventType = new EventType({ type, description });
    await newEventType.save();

    // QR COde  Generation
    // Data to encode in the QR code
    const data = newEventType; // Replace this with any text or URL

    // Path to save the QR code image
    const outputFilePath = './qrcode.png';

    // Generate and save QR code as an image file
    QRCode.toFile(outputFilePath, data, { width: 300 }, (err) => {
      if (err) {
        console.error('Error generating QR code:', err);
        return;
      }
      console.log(`QR code saved to ${outputFilePath}`);
    });



    res.status(201).json({ message: "Event type created successfully", newEventType });
  } catch (error) {
    res.status(500).json({ message: "Failed to create event type", error });
  }
};

// POST: Update an existing event type
const updateEventType = async (req, res) => {
  try {
    const { type, description, is_active } = req.body;
    const { id } = req.params
    const updatedEventType = await EventType.findByIdAndUpdate(
      id,
      { type, description, is_active },
      { new: true, runValidators: true }
    );

    if (!updatedEventType) {
      return res.status(404).json({ message: "Event type not found" });
    }

    res.status(200).json({ message: "Event type updated successfully", data: updatedEventType, success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to update event type", error, success: false });
  }
};

// POST: Delete an event type
const deleteEventType = async (req, res) => {
  try {
    const { id } = req.body;

    const deletedEventType = await EventType.findByIdAndDelete(id);

    if (!deletedEventType) {
      return res.status(404).json({ message: "Event type not found" });
    }

    res.status(200).json({ message: "Event type deleted successfully", deletedEventType });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete event type", error });
  }
};

const getEventTypeByID = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEventType = await EventType.findById(id)
      ;

    if (!deletedEventType) {
      return res.status(404).json({ message: "Event type not found" });
    }

    res.status(200).json({ message: "Event type get successfully", data: deletedEventType });
  } catch (error) {
    res.status(500).json({ message: "Failed to get event type", error });
  }
}


// Creating New Event Booking
const eventBooking = async (req, res) => {
  try {
    const { users } = req.body;
    // console.log("Users from front", req.body);

    // Checking if user is empty or not
    if (!users || users.length === 0) {
      return res.status(400).json({
        error: "Users array is empty.",
      });
    }

    // Mapping users to create the base data without qr_code
    const usersArray = users.map((user, index) => {
      if (!user.names || !user.mobile_numbers || !user.emails) {
        throw new Error("Missing required fields for user at index " + index);
      }

      // defining file name
      const pictureFile = req.files.find(file => file.fieldname === `users[${index}][pictures]`);

      return {
        pictures: pictureFile ? pictureFile.path : "",
        names: user.names,
        mobile_numbers: user.mobile_numbers,
        emails: user.emails,
        organization_names: user.organization_names,
        cities: user.cities,
        created_at: new Date(),
        updated_at: new Date(),
      };
    });

    // saving the booking
    const savedEventBooking = new EventBookingNews({
      users: usersArray,
    });
    await savedEventBooking.save(); // Save without qr_codes

    // Directory to store the QR Codes
    const qrCodeDirectory = path.join(__dirname, '../../uploads', 'qrCode');

    // Checking if folder exists , if not exists then create the directory
    const fs = require('fs');
    if (!fs.existsSync(qrCodeDirectory)) {
      fs.mkdirSync(qrCodeDirectory, { recursive: true }); 
    }

    // Making All users QR Code by mapping each user ID
    const updatedUsersArray = await Promise.all(savedEventBooking.users.map(async (user, index) => {
      const userId = user._id; // MongoDB ObjectId for each user

      // Generate QR code with ObjectId
      const qrCodeFilePath = path.join(qrCodeDirectory, `qrcode_${index}_${userId}.png`); // Full path with file name

      // Generate QR code and save as image
      await QRCode.toFile(qrCodeFilePath, `${userId}`, {
        color: {
          dark: '#000000',  // Dark color (QR code)
          light: '#ffffff'  // Light color (background)
        },
        width: 300  // Adjust the size of the QR code
      });

      // Now, update the user object with the QR code path
      user.qr_code = path.relative(path.join(__dirname, '../../'), qrCodeFilePath); // Save relative path
      return user;
    }));

    // Update the savedEventBooking with the qr_code field populated for each user
    savedEventBooking.users = updatedUsersArray;

    // Save the updated event booking with qr_code paths
    const is_saved = await savedEventBooking.save();
    if (!is_saved) {
      console.log("not saved.");
    }
    // console.log("saved.");

    // Success Response
    res.status(201).json({
      message: "Bookings added successfully with QR codes",
      data: savedEventBooking,
    });

  } catch (error) {
    console.error("Error adding booking:", error);
    res.status(400).json({ error: error.message || "Internal server error" });
  }
};






// Showing Unique User Data ( Scanning the QR Code and getting the user id )
const showUserData = async (req, res) => {
  try {
    // console.log("hitted", req.params.id);

    // Find the user inside the users array using userId from request
    const eventBooking = await EventBookingNews.findOne({ "users._id": req.params.id });
    // console.log(eventBooking)

    // if not data found
    if (!eventBooking) {
      return res.status(404).json({ message: "Event booking not found" });
    }

    // Find the user inside the users array
    const user = eventBooking.users.find(user => user._id.toString() === req.params.id);

    // if user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // success message
    res.status(200).json({ message: "User details found", data: user });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Error fetching user details", error });
  }

}

// Update User Entry To True ( When user enter the event )
const updateEntry = async (req, res) => {

  // user id of which entr to update
  const to_update = req.params.id
  // console.log(to_update)

  try {
    // finding and updating the user entry feild to true
    const eventBooking = await EventBookingNews.findOneAndUpdate({ "users._id": req.params.id }, { $set: { "users.$.isPresent": true } }, { new: true });
    if (!eventBooking) {
      console.log("User not updated.")
    }
    // console.log("User updated.", eventBooking)

    // success response
    res.status(200).json({ message: "Entry Updated.", eventBooking })

  }
  catch (error) {
    console.log(error)
  }

}

// Adding Event Details
const eventDetails = async (req, res) => {
  try {
    const {
      customer_name,
      customer_mobile,
      customer_email,
      customer_organization,
      customer_city,
      ticket_amount,
      created_by
    } = req.body;

    // Validate that all required fields are provided
    if (!customer_name || !customer_mobile || !customer_email || !customer_organization || !customer_city || !ticket_amount || !created_by) {
      return res.status(400).json({
        error: "All text fields are required.",
      });
    }

    // Validate that the file exists
    if (!req.file) {
      return res.status(400).json({
        error: "Customer picture is required.",
      });
    }

    // Create a new event detail entry
    const newEventDetails = new EventDetails({
      customer_name,
      customer_picture: req.file.path, // Save the uploaded file path
      customer_mobile,
      customer_email,
      customer_organization,
      customer_city,
      ticket_amount,
      created_by,
    });

    const savedEventDetails = await newEventDetails.save();

    res.status(201).json({
      message: "Event details added successfully",
      data: savedEventDetails,
    });
  } catch (error) {
    console.error("Error adding event details:", error);
    res.status(500).json({ error: "Internal server error" });
  }

}



module.exports = { deleteEventType, createEventType, getEventType, updateEventType, getEventTypeByID, eventBooking, eventDetails, showUserData, updateEntry }