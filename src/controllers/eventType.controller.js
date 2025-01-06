const { EventType } = require("../models");

const EventBooking = require("../models/eventBookingSchema");
const EventDetails = require("../models/eventDetailsSchema");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
// const QRCode = require('qrcode');
const QRCode = require('qrcode');
const fs = require('fs');
const crypto = require('crypto');
// const transporter = require('../utils/nodemailer');

const EventBookingNews = require("../models/eventBookingSchemas");
// const EventBookingNew = require("../models/eventBookingSchemas");


const path = require("path"); // Import path for handling file paths

const nodemailer = require('nodemailer');
const Customer = require("../models/customerSchema");
const { tokenService } = require("../service");
const { custom } = require("joi");
const Bookings = require("../models/bookingsSchema");
const BookingDetails = require("../models/eventBookingSchemas");
const Booking = require("../models/bookingsSchema");
const { Event } = require("../models/event.model");
const generateTicketId = require("../utils/generateTicketId");
const createQRCode = require("../utils/createQRCode");
const { sendMail } = require("../utils/nodemailer");
const createDirectory = require("../utils/createDirectory");
const sendEmail = require("../utils/sendEmail");




// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.PASSWORD,
//   },
// });
console.log("****************************", process.env.EMAIL)
console.log("****************************", process.env.PASSWORD)



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

// Register Customer

// const registerCustomer = async (req, res) => {
//   const { first_name, last_name, email, number, password, passwordcnfrm } = req.body;
//   console.log("data", req.body);

//   try {
//     // Validation for required fields
//     if (!first_name || !last_name || !email || !number || !password || !passwordcnfrm) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ error: "Invalid email format" });
//     }

//     // Phone number validation (assuming basic check for numbers)
//     const phoneRegex = /^[0-9]{10}$/;
//     if (!phoneRegex.test(number)) {
//       return res.status(400).json({ error: "Invalid phone number format" });
//     }

//     // Password confirmation validation
//     if (password !== passwordcnfrm) {
//       return res.status(400).json({ error: "Passwords do not match" });
//     }

//     // Password length validation (optional, depending on your requirements)
//     if (password.length < 8) {
//       return res.status(400).json({ error: "Password must be at least 8 characters long" });
//     }

//     // Check if the email already exists in the database
//     const existingCustomer = await Customer.findOne({ email });
//     if (existingCustomer) {
//       return res.status(400).json({ error: "Email already registered" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new customer record
//     const newCustomer = new Customer({
//       first_name,
//       last_name,
//       email,
//       number,
//       password: hashedPassword,
//     });

//     // Generate authentication tokens (optional based on your token service)
//     const user = await tokenService.generateAuthTokens(newCustomer);

//     // Save the new customer to the database
//     await newCustomer.save();

//     console.log("Customer Registered.");
//     res.status(201).json({ message: "Customer registered successfully", data: user });
//   } catch (error) {
//     console.error("Error registering customer:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
// const registerCustomer = async (req, res) => {
//   const { first_name, last_name, email, number, password, passwordcnfrm } = req.body;

//   console.log("data", req.body);

//   try {
//     // Validation
//     if (!first_name || !last_name || !email || !number || !password || !passwordcnfrm) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ error: "Invalid email format" });
//     }

//     // Validate if passwords match
//     if (password !== passwordcnfrm) {
//       return res.status(400).json({ error: "Passwords do not match" });
//     }

//     // Check if the email already exists
//     const existingCustomer = await Customer.findOne({ email });
//     if (existingCustomer) {
//       return res.status(400).json({ error: "Email already registered" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new customer
//     const newCustomer = new Customer({
//       first_name,
//       last_name,
//       email,
//       number,
//       password: hashedPassword,
//     });

//     const user = await tokenService.generateAuthTokens(newCustomer);

//     // Save the customer
//     await newCustomer.save();

//     console.log("Customer Registered.");
//     res.status(201).json({ success: true, message: "Customer registered successfully", data: user });
//   } catch (error) {
//     console.error("Error registering customer:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };



// Login Customer
// const loginCustomer = async (req, res) => {
//   const { email, password } = req.body;
//   // console.log("data", email, password);

//   try {
//     // Validate inputs
//     if (!email || !password) {
//       return res.status(400).json({ error: "Email and password are required" });
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ error: "Invalid email format" });
//     }

//     // Check if the customer exists
//     const customer = await Customer.findOne({ email });
//     if (!customer) {
//       return res.status(404).json({ error: "Customer not found" });
//     }

//     console.log("******", customer)
//     // Compare the provided password with the hashed password in the database
//     const isPasswordValid = await bcrypt.compare(password, customer.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ success: false, error: "Invalid email or password" });
//     }

//     // Generate a JWT token (optional, if using JWT for authentication)
//     // const token = jwt.sign(
//     //   { id: customer._id, email: customer.email },
//     //   process.env.JWT_SECRET,
//     //   { expiresIn: process.env.JWT_ACCESS_EXPIRATION_MINUTES }
//     // );
//     const user = await tokenService.generateAuthTokens(customer)
//     // console.log("^^^^^",user)


//     // Successful login response
//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       data: user, // Optional: Include the token if you're using JWT
//       user: customer
//     });
//   } catch (error) {
//     console.error("Error logging in customer:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }

// };
// const loginCustomer = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Validate inputs
//     if (!email || !password) {
//       return res.status(400).json({ error: "Email and password are required" });
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ error: "Invalid email format" });
//     }

//     // Check if the customer exists
//     const customer = await Customer.findOne({ email }).select("-password"); // Exclude password
//     if (!customer) {
//       return res.status(404).json({ error: "Customer not found" });
//     }

//     // Retrieve the full customer object with the password for validation
//     const fullCustomer = await Customer.findOne({ email });

//     // Compare the provided password with the hashed password in the database
//     const isPasswordValid = await bcrypt.compare(password, fullCustomer.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ success: false, error: "Invalid email or password" });
//     }

//     // Generate a JWT token (optional, if using JWT for authentication)
//     const user = await tokenService.generateAuthTokens(fullCustomer);

//     // Successful login response
//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       data: user, // Include the token if you're using JWT
//       user: customer, // `customer` already has the password excluded
//     });
//   } catch (error) {
//     console.error("Error logging in customer:", error);
//     res.status(500).json({ error: "Internal server error" });
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

// Get all Users
// const getEventInfo = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = "", sort = "",  } = req.query;
//     const { id } = req.params; // event id
//     const options = {
//       page: parseInt(page, 10),
//       limit: parseInt(limit, 10),
//       sort,
//       search,
//     };
//     // console.log("fron frnt", id)

//     const query = {};
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } }, // Example: Searching by name (case insensitive)
//         { description: { $regex: search, $options: "i" } }, // Example: Searching by description
        
//       ];
//     }
//     // const skip = (page - 1) * limit;
//     // Finding Event
//     const find_event = await Bookings.find({ event_id: id });
//     // console.log("total booking for a particular event:", find_event) // 13 sari booing ek event ki

//     // Calculatong total no of Boonig fora particular event
//     const total_bookings = await Bookings.find({ event_id: id });
//     // console.log("total bookings", total_bookings)



//     // Default sorting by creation date
//     const sortOptions = sort ? { [sort]: 1 } : { created_at: -1 };
//     // Pagination: skip and limit
//     const skip = (page - 1) * limit;
//     // All Bookings of a event
//     // const all_bookings = await BookingDetails.find({ event_id: id })(query)
//     // .sort(sortOptions)
//     // .skip(skip)
//     // .limit(limit);
//     const all_bookings = await BookingDetails.find({
//       event_id: id,
//       ...query,
//     })
//       .sort(sortOptions)
//       .skip(skip)
//       .limit(limit);
//     console.log(all_bookings, "---------------all_bookings---------------");

//     // Fetching only Booking ID
//     const bookingID = await Bookings.findOne({ event_id: id });
//     // console.log("booking id: ", bookingID) // 67778c8dd5ac3bab61259db5

//     // Fetching Attendies of a Booking
//     const attendies = await BookingDetails.find({ booking_id: bookingID._id })
//     // console.log(attendies, "---------------attendies---------------");



//     if (!find_event) {
//       return res.status(404).json({ message: "Event type not found" });
//     }
//     // console.log(find_event, "---------------find_event---------------");


//     // res.status(200).json({  success: true, message: "Event booking fetched successfully", totalBookings: total_bookings, data: find_event });
//     // res.status(200).json({ success: true, message: "Event booking fetched successfully", totalBookings: total_bookings, totalAttendies: attendies });
//     res.status(200).json({ success: true, message: "Event booking users fetched successfully", totalBookings: total_bookings, totalAttendies: all_bookings });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to get event type", error });
//   }
// }
const getEventInfo = async (req, res) => {
  try {
    // Extract query parameters
    const { page = 1, limit = 10, search = "", sort = "" } = req.query;
    const { id } = req.params; // event ID

    // Parse and sanitize parameters
    const currentPage = parseInt(page, 10);
    const itemsPerPage = parseInt(limit, 10);

    // Build query object
    const query = { event_id: id }; // Event-specific filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } }, // Search in 'name'
        { description: { $regex: search, $options: "i" } }, // Search in 'description'
      ];
    }

    // Calculate skip and limit
    const skip = (currentPage - 1) * itemsPerPage;

    // Sorting options
    const sortOptions = sort ? { [sort]: 1 } : { created_at: -1 };

    // Fetch total bookings and total attendees
    const totalBookings = await BookingDetails.countDocuments({event_id: id });
    console.log(totalBookings, "---------------totalBookings---------------");
    const allBookings = await BookingDetails.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(itemsPerPage);

    // Calculate total pages
    const totalPages = Math.ceil(totalBookings / itemsPerPage);

    // Respond with paginated data
    res.status(200).json({
      success: true,
      message: "Event booking users fetched successfully",
      totalBookings,
      currentPage,
      totalPages,
      itemsPerPage,
      data: allBookings,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get event type", error });
  }
};




// const qrCodeDirectory = path.join(__dirname, 'public', 'qrcodes');

// // Ensure the directory exists, or create it if it doesn't
// if (!fs.existsSync(qrCodeDirectory)) {
//   fs.mkdirSync(qrCodeDirectory, { recursive: true });
// }



//  BACKUP
// const eventBooking = async (req, res) => {
//   try {
//     const qrCodeDirectory = path.join(__dirname, '../uploads', 'qrCode');
//     if (!fs.existsSync(qrCodeDirectory)) {
//       fs.mkdirSync(qrCodeDirectory, { recursive: true });
//     }



//     const bookingDetailsArray = [];
//     const totalMembers = req.body.users.length;

//     // Generating Ticket ID
//     function generateTicketId() {
//       return Math.floor(10000000 + Math.random() * 90000000); // Generates a random 8-digit number
//     }

//     console.log("Ticket ID", generateTicketId());


//     const newBooking = new Booking({
//       event_id: req.params.eventid,
//       event_from_date: new Date(),
//       event_to_date: new Date(),
//       // ticket_id: "6770c8deba668872f67b794a",
//       ticket_id: generateTicketId(),
//       ticket_price: 1000,
//       no_of_members: totalMembers,
//       booked_by: "6770c8deba668872f67b794a",
//       booked_at: new Date(),
//       created_at: new Date(),
//       updated_at: new Date(),
//     });

//     const savedBooking = await newBooking.save();

//     for (let i = 0; i < req.body.users.length; i++) {
//       const user = req.body.users[i];

//       const pictureFile = req.files ? req.files.find(file => file.fieldname === `users[${i}][pictures]`) : null;

//       const customer_picture = pictureFile ? pictureFile.filename : "";
//       const customer_name = user.names;
//       const customer_phone = user.mobile_numbers;
//       const customer_email = user.emails;
//       const customer_city = user.cities;
//       const customer_organisation = user.organization_names;

//       const uniqueCode = `${new Date().getTime()}${Math.floor(10 + Math.random() * 90)}`;
//       const uniqueCustomerCode = `${new Date().getTime()}${Math.floor(10 + Math.random() * 90)}`;
//       const qrCodeFilePath = path.join(qrCodeDirectory, `qrcode_${uniqueCode}.png`);

//       await QRCode.toFile(qrCodeFilePath, uniqueCode, {
//         color: { dark: "#000000", light: '#fbf1e8' },
//         width: 300,
//       });

//       const newBookingDetails = new BookingDetails({
//         customer_picture,
//         customer_name,
//         customer_phone,
//         customer_email,
//         customer_city,
//         customer_organisation,
//         customer_qr_picture: `qrcode_${uniqueCode}.png`,
//         customer_qr_code: uniqueCustomerCode,
//         booking_id: savedBooking._id,
//       });

//       const savedBookingDetails = await newBookingDetails.save();
//       bookingDetailsArray.push(savedBookingDetails);

//       // const transporter = nodemailer.createTransport({
//       //   service: 'mail',
//       //   auth: {
//       //     user: process.env.EMAIL, 
//       //     pass: process.env.PASSWORD, 
//       //   },
//       // });
//       console.log(user.emails, "---------------user.emails---------------")
//       try {
//         console.log("---------------hitting---------------");
//         await transporter.sendMail({
//           from: `"Your Ticket is Successfully Generated - Ready to Go!" <your-email@gmail.com>`,
//           to: user.emails,
//           subject: "Your Event QR Code",
//           text: `Hello ${customer_name},\n\nHere is your QR code for the event.`,
//           html: `
//             <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>India Industrial Fair</title>
//        <style>
//     body {
//       margin: 0;
//       font-family: Arial, sans-serif;
//       background-color: #f7f7f7;
//       color: #333;
//     }
//     .container {
//       max-width: 600px;
//       margin: 0 auto;
//       background: #FBF1E8;
//       border-radius: 10px;
//       box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
//       overflow: hidden;
//       background-image: url('cid:bcakImg');
//       background-position: center;
//       background-size: cover;
//     }
//     .header, .footer {
//       text-align: center;
//       padding: 20px;

//     }
//     .header img {
//       max-width: 80px;
//       height: auto;
//     }
//     .title {
//       font-size: 1.5rem;
//       margin: 10px 0;
//       font-weight: bold;
//     }
//     .date-location {
//       color: #E5552E;
//       font-size: 1.25rem;
//       font-weight: bold;
//       margin: 10px 0;
//     }
//     .visitors-section {
//       text-align: center;
//       border: 2px solid #000;
//       padding: 15px;
//       margin: 15px;
//       border-radius: 10px;
//     }
//     .visitors-section img {
//       max-width: 150px;
//       margin: 10px 0;
//     }
//     .username {
//       font-size: 1.25rem;
//       color: #000;
//       font-weight: bold;
//     }
//     .footer img {
//       max-width: 100px;
//       margin: 10px;
//     }
//     @media (max-width: 768px) {
//       .container {
//         width: 90%;
//       }
//       .title {
//         font-size: 1.25rem;
//       }
//       .date-location {
//         font-size: 1rem;
//       }
//       .visitors-section {
//         font-size: 1rem;
//       }
//     }
//     @media (max-width: 480px) {
//       .header img, .footer img {
//         max-width: 50px;
//       }
//       .title {
//         font-size: 1rem;
//       }
//       .date-location {
//         font-size: 0.875rem;
//       }
//       .visitors-section {
//         font-size: 0.875rem;
//       }
//     }
//   </style>

//     </head>
//     <body>
//         <div class="header">
//             <p> Your Ticket is Successfully Generated! </p>
//         </div>
//         <div class="body">
//             <p>Hi ${user.names},</p>
//             <p>We’re excited to inform you that your ticket has been successfully generated!</p>
//             <p>Here are the details of your ticket:</p>
//         </div> 


//   <div class="container" style="max-width: 600px; background-image: url('cid:bcakImg'); background-position: center; background-size: center; border-radius: 10px; margin: auto; padding: 20px; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2); font-family: Arial, sans-serif;">
//   <div class="header" style="text-align: center;">
//     <img src="cid:logo" style="width: 60px; height: auto; margin-bottom: 10px;" alt="Logo">
//     <img src="cid:event" style="width: 220px; height: auto; margin-bottom: 10px;" alt="Event Logo">
//     <img src="cid:india" style="width: 120px; height: auto; margin-bottom: 10px;" alt="Make in India">
//     <div class="title" style="font-size: 22px; color: #000000; font-weight: 700; margin: 10px 0;">11TH <span style="color: #E5552E;">INDIA INDUSTRIAL FAIR 2025</span></div>
//     <div class="date-location" style="color: #d9534f; font-size: 22px; font-weight: 900; margin: 15px 0;">10-13 JANUARY</div>
//     <div class="date-location2" style="text-align: center; color: #d9534f; font-size: 22px; font-weight: 900; margin: 15px 0;">
//       <table style="width: 100%; table-layout: fixed;">
//         <tr>
//           <td style="padding: 0;">
//             <img src="cid:location" style="width: 30px; height: auto; vertical-align: middle;" alt="Location">
//             <span style="vertical-align: middle;">DPS GROUND, BHUWANA, UDAIPUR</span>
//           </td>
//         </tr>
//       </table>
//     </div>
//   </div>

//   <div class="visitors-section" style="border: 3px solid #000; border-radius: 10px; background-color: #FBF1E8; padding: 15px; text-align: center; font-weight: bold; font-size: 20px; margin: 15px auto; max-width: 70%;">
//     <div class="heading" style="font-size: 24px; font-weight: 900; color: #000000;">VISITORS</div>
//     <img src="cid:qrcode" style="margin-top: 10px;" alt="QR Code">
//     <div class="username" style="font-size: 18px; font-weight: 900; color: #000000; margin-top: 10px;">${user.names}</div>
//   </div>

//  <div class="footer" style="text-align: center; margin-top: 20px;">
//   <div class="title" style="font-size: 22px; color: #000000; font-weight: 700;">OUR SPONSOR</div>
//   <table align="center" style="width: 100%; margin-top: 20px; table-layout: fixed; border-collapse: collapse;">
//     <tr>
//       <td align="center" style="padding: 5px; width: 25%;">
//         <img src="cid:sponsor1" style="max-width: 100px; width: 80%; height: auto;" alt="Sponsor 1">
//       </td>
//       <td align="center" style="padding: 5px; width: 25%;">
//         <img src="cid:sponsor2" style="max-width: 100px; width: 80%; height: auto;" alt="Sponsor 2">
//       </td>
//       <td align="center" style="padding: 5px; width: 25%;">
//         <img src="cid:sponsor3" style="max-width: 100px; width: 80%; height: auto;" alt="Sponsor 3">
//       </td>
//       <td align="center" style="padding: 5px; width: 25%;">
//         <img src="cid:sponsor4" style="max-width: 100px; width: 80%; height: auto;" alt="Sponsor 4">
//       </td>
//     </tr>
//   </table>
// </div>

// </div>


//     </body>
//     </html>
//           `,
//           attachments: [
//             {
//               filename: `qrcode_${uniqueCode}.png`,
//               path: qrCodeFilePath,
//               cid: 'qrcode',
//             },

//             {
//               filename: 'lubnew.png',
//               // path: '../static_img/lub.png',
//               path: './src/static_img/lubnew.png',

//               cid: 'logo'
//             },
//             {
//               filename: 'Groupp.png',
//               // path: '../static_img/lub.png',
//               path: './src/static_img/Groupp.png',

//               cid: 'bcakImg'
//             },

//             { // fair
//               filename: 'removedbgimg.png',
//               // path: '../static_img/fair.png',
//               path: './src/static_img/removedbgimg.png',
//               cid: 'event'
//             },
//             { // make in india
//               filename: 'makeinindianew.png',
//               // path: '../static_img/makeinindia.png', 
//               path: './src/static_img/makeinindianew.png',
//               cid: 'india' // This is the unique Content-ID for the logo image
//             },
//             { // location
//               filename: 'locationnew.png',
//               // path: '../static_img/makeinindia.png', 
//               path: './src/static_img/locationnew.png',
//               cid: 'location' // This is the unique Content-ID for the logo image
//             },
//             {
//               filename: 'miraj2.png',
//               // path: '../static_img/miraj.png', 
//               path: './src/static_img/miraj2.png',
//               cid: 'sponsor1'
//             },
//             {
//               filename: 'anantanew.png',
//               // path: '../static_img/ananta.png',
//               path: './src/static_img/anantanew.png',
//               cid: 'sponsor2'
//             },
//             {
//               filename: 'iveonew.png',
//               // path: '../static_img/iveo.png',
//               path: './src/static_img/ievonew.png',
//               cid: 'sponsor3'
//             },
//             {
//               filename: 'wondernew.png',
//               // path: '../static_img/wonder.png',
//               path: './src/static_img/wondernew.png',
//               cid: 'sponsor4'
//             }
//           ],

//         });
//       } catch (emailError) {
//         console.error("Error sending email to", customer_email, emailError);
//       }
//     }

//     res.status(201).json({
//       message: "Booking successfully created",
//       booking: {
//         ...savedBooking.toObject(),
//         details: bookingDetailsArray,
//       },
//     });

//   } catch (error) {
//     console.error("Error in booking creation:", error);
//     res.status(500).json({
//       message: "An error occurred while creating the booking",
//       error: error.message,
//     });
//   }
// };
// const eventBooking = async (req, res) => {
//   try {
//     const qrCodeDirectory = path.join(__dirname, '../uploads', 'qrCode');
//     if (!fs.existsSync(qrCodeDirectory)) {
//       fs.mkdirSync(qrCodeDirectory, { recursive: true });
//     }



//     const bookingDetailsArray = [];
//     const totalMembers = req.body.users.length;

//     // Generating Ticket ID
//     function generateTicketId() {
//       return Math.floor(10000000 + Math.random() * 90000000); // Generates a random 8-digit number
//     }
//     const ticketId = generateTicketId()

//     console.log("Ticket ID", ticketId);


//     const newBooking = new Booking({
//       event_id: req.params.eventid,
//       event_from_date: new Date(),
//       event_to_date: new Date(),
//       // ticket_id: "6770c8deba668872f67b794a",
//       ticket_id: ticketId,
//       ticket_price: 1000,
//       no_of_members: totalMembers,
//       booked_by: "6770c8deba668872f67b794a",
//       booked_at: new Date(),
//       created_at: new Date(),
//       updated_at: new Date(),
//     });

//     const savedBooking = await newBooking.save();

//     for (let i = 0; i < req.body.users.length; i++) {
//       const user = req.body.users[i];

//       const pictureFile = req.files ? req.files.find(file => file.fieldname === `users[${i}][pictures]`) : null;

//       const customer_picture = pictureFile ? pictureFile.filename : "";
//       const customer_name = user.names;
//       const customer_phone = user.mobile_numbers;
//       const customer_email = user.emails;
//       const customer_city = user.cities;
//       const customer_organisation = user.organization_names;

//       const uniqueCode = `${new Date().getTime()}${Math.floor(10 + Math.random() * 90)}`;
//       const uniqueCustomerCode = `${new Date().getTime()}${Math.floor(10 + Math.random() * 90)}`;
//       const qrCodeFilePath = path.join(qrCodeDirectory, `qrcode_${uniqueCode}.png`);

//       await QRCode.toFile(qrCodeFilePath, uniqueCode, {
//         color: { dark: "#000000", light: '#fbf1e8' },
//         width: 300,
//       });

//       const newBookingDetails = new BookingDetails({
//         customer_picture,
//         customer_name,
//         customer_phone,
//         customer_email,
//         customer_city,
//         customer_organisation,
//         customer_qr_picture: `qrcode_${uniqueCode}.png`,
//         customer_qr_code: uniqueCustomerCode,
//         booking_id: savedBooking._id,
//       });

//       const savedBookingDetails = await newBookingDetails.save();
//       bookingDetailsArray.push(savedBookingDetails);

//       // const transporter = nodemailer.createTransport({
//       //   service: 'mail',
//       //   auth: {
//       //     user: process.env.EMAIL, 
//       //     pass: process.env.PASSWORD, 
//       //   },
//       // });
//       console.log(user.emails, "---------------user.emails---------------")
//       try {
//         console.log("---------------hitting---------------");
//         await transporter.sendMail({
//           from: `"Your Ticket is Successfully Generated - Ready to Go!" <your-email@gmail.com>`,
//           to: user.emails,
//           subject: "Your Event QR Code",
//           text: `Hello ${customer_name},\n\nHere is your QR code for the event.`,
//           html: `
//             <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>India Industrial Fair</title>
//        <style>
//     body {
//       margin: 0;
//       font-family: Arial, sans-serif;
//       background-color: #f7f7f7;
//       color: #333;
//     }
//     .container {
//       max-width: 600px;
//       margin: 0 auto;
//       background: #FBF1E8;
//       border-radius: 10px;
//       box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
//       overflow: hidden;
//       background-image: url('cid:bcakImg');
//       background-position: center;
//       background-size: cover;
//     }
//     .header, .footer {
//       text-align: center;
//       padding: 20px;

//     }
//     .header img {
//       max-width: 80px;
//       height: auto;
//     }
//     .title {
//       font-size: 1.5rem;
//       margin: 10px 0;
//       font-weight: bold;
//     }
//     .date-location {
//       color: #E5552E;
//       font-size: 1.25rem;
//       font-weight: bold;
//       margin: 10px 0;
//     }
//     .visitors-section {
//       text-align: center;
//       border: 2px solid #000;
//       padding: 15px;
//       margin: 15px;
//       border-radius: 10px;
//     }
//     .visitors-section img {
//       max-width: 150px;
//       margin: 10px 0;
//     }
//     .username {
//       font-size: 1.25rem;
//       color: #000;
//       font-weight: bold;
//     }
//     .footer img {
//       max-width: 100px;
//       margin: 10px;
//     }
//     @media (max-width: 768px) {
//       .container {
//         width: 90%;
//       }
//       .title {
//         font-size: 1.25rem;
//       }
//       .date-location {
//         font-size: 1rem;
//       }
//       .visitors-section {
//         font-size: 1rem;
//       }
//     }
//     @media (max-width: 480px) {
//       .header img, .footer img {
//         max-width: 50px;
//       }
//       .title {
//         font-size: 1rem;
//       }
//       .date-location {
//         font-size: 0.875rem;
//       }
//       .visitors-section {
//         font-size: 0.875rem;
//       }
//     }
//   </style>

//     </head>
//     <body>
//         <div class="header">
//             <p> Your Ticket is Successfully Generated! </p>
//         </div>
//         <div class="body">
//             <p>Hi ${user.names},</p>
//             <p>We’re excited to inform you that your ticket has been successfully generated!</p>
//             <p>Here are the details of your ticket:</p>
//         </div> 


//   <div class="container" style="max-width: 600px; background-image: url('cid:bcakImg'); background-position: center; background-size: center; border-radius: 10px; margin: auto; padding: 20px; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2); font-family: Arial, sans-serif;">
//   <div class="header" style="text-align: center;">
//     <img src="cid:logo" style="width: 60px; height: auto; margin-bottom: 10px;" alt="Logo">
//     <img src="cid:event" style="width: 220px; height: auto; margin-bottom: 10px;" alt="Event Logo">
//     <img src="cid:india" style="width: 120px; height: auto; margin-bottom: 10px;" alt="Make in India">
//     <div class="title" style="font-size: 22px; color: #000000; font-weight: 700; margin: 10px 0;">11TH <span style="color: #E5552E;">INDIA INDUSTRIAL FAIR 2025</span></div>
//     <div class="date-location" style="color: #d9534f; font-size: 22px; font-weight: 900; margin: 15px 0;">10-13 JANUARY</div>
//     <div class="date-location2" style="text-align: center; color: #d9534f; font-size: 22px; font-weight: 900; margin: 15px 0;">
//       <table style="width: 100%; table-layout: fixed;">
//         <tr>
//           <td style="padding: 0;">
//             <img src="cid:location" style="width: 30px; height: auto; vertical-align: middle;" alt="Location">
//             <span style="vertical-align: middle;">DPS GROUND, BHUWANA, UDAIPUR</span>
//           </td>
//         </tr>
//       </table>
//     </div>
//   </div>

//   <div class="visitors-section" style="border: 3px solid #000; border-radius: 10px; background-color: #FBF1E8; padding: 15px; text-align: center; font-weight: bold; font-size: 20px; margin: 15px auto; max-width: 70%;">
//     <div class="heading" style="font-size: 24px; font-weight: 900; color: #000000;">VISITORS</div>
//     <img src="cid:qrcode" style="margin-top: 10px;" alt="QR Code">
//     <div class="username" style="font-size: 18px; font-weight: 900; color: #000000; margin-top: 10px;">${user.names}</div>
//   </div>

//  <div class="footer" style="text-align: center; margin-top: 20px;">
//   <div class="title" style="font-size: 22px; color: #000000; font-weight: 700;">OUR SPONSOR</div>
//   <table align="center" style="width: 100%; margin-top: 20px; table-layout: fixed; border-collapse: collapse;">
//     <tr>
//       <td align="center" style="padding: 5px; width: 25%;">
//         <img src="cid:sponsor1" style="max-width: 100px; width: 80%; height: auto;" alt="Sponsor 1">
//       </td>
//       <td align="center" style="padding: 5px; width: 25%;">
//         <img src="cid:sponsor2" style="max-width: 100px; width: 80%; height: auto;" alt="Sponsor 2">
//       </td>
//       <td align="center" style="padding: 5px; width: 25%;">
//         <img src="cid:sponsor3" style="max-width: 100px; width: 80%; height: auto;" alt="Sponsor 3">
//       </td>
//       <td align="center" style="padding: 5px; width: 25%;">
//         <img src="cid:sponsor4" style="max-width: 100px; width: 80%; height: auto;" alt="Sponsor 4">
//       </td>
//     </tr>
//   </table>
// </div>

// </div>


//     </body>
//     </html>
//           `,
//           attachments: [
//             {
//               filename: `qrcode_${uniqueCode}.png`,
//               path: qrCodeFilePath,
//               cid: 'qrcode',
//             },

//             {
//               filename: 'lubnew.png',
//               // path: '../static_img/lub.png',
//               path: './src/static_img/lubnew.png',

//               cid: 'logo'
//             },
//             {
//               filename: 'Groupp.png',
//               // path: '../static_img/lub.png',
//               path: './src/static_img/Groupp.png',

//               cid: 'bcakImg'
//             },

//             { // fair
//               filename: 'removedbgimg.png',
//               // path: '../static_img/fair.png',
//               path: './src/static_img/removedbgimg.png',
//               cid: 'event'
//             },
//             { // make in india
//               filename: 'makeinindianew.png',
//               // path: '../static_img/makeinindia.png', 
//               path: './src/static_img/makeinindianew.png',
//               cid: 'india' // This is the unique Content-ID for the logo image
//             },
//             { // location
//               filename: 'locationnew.png',
//               // path: '../static_img/makeinindia.png', 
//               path: './src/static_img/locationnew.png',
//               cid: 'location' // This is the unique Content-ID for the logo image
//             },
//             {
//               filename: 'miraj2.png',
//               // path: '../static_img/miraj.png', 
//               path: './src/static_img/miraj2.png',
//               cid: 'sponsor1'
//             },
//             {
//               filename: 'anantanew.png',
//               // path: '../static_img/ananta.png',
//               path: './src/static_img/anantanew.png',
//               cid: 'sponsor2'
//             },
//             {
//               filename: 'iveonew.png',
//               // path: '../static_img/iveo.png',
//               path: './src/static_img/ievonew.png',
//               cid: 'sponsor3'
//             },
//             {
//               filename: 'wondernew.png',
//               // path: '../static_img/wonder.png',
//               path: './src/static_img/wondernew.png',
//               cid: 'sponsor4'
//             }
//           ],

//         });
//       } catch (emailError) {
//         console.error("Error sending email to", customer_email, emailError);
//       }
//     }

//     res.status(201).json({
//       message: "Booking successfully created",
//       booking: {
//         ...savedBooking.toObject(),
//         details: bookingDetailsArray,
//       },
//     });

//   } catch (error) {
//     console.error("Error in booking creation:", error);
//     res.status(500).json({
//       message: "An error occurred while creating the booking",
//       error: error.message,
//     });
//   }
// };

const transporter = nodemailer.createTransport({
  service: 'gmail', // Replace with your service
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// ye lsted he or working he
// const eventBooking = async (req, res) => {
//   try {
//     // 6763cf93822b612f06dbd5e1
//     // console.log("req.params.eventid", req.params.eventid)
//     // const find_event = await Event.findById( req.params.eventid )
//     const find_event = await Event.findById(req.params.eventid).select('start_date end_date');

//     // console.log("event", find_event)


//     const qrCodeDirectory = path.join(__dirname, '../uploads', 'qrCode');
//     if (!fs.existsSync(qrCodeDirectory)) {
//       // fs.mkdirSync(qrCodeDirectory, { recursive: true });

//       await fs.promises.mkdir(qrCodeDirectory, { recursive: true });

//     }

//     const bookingDetailsArray = [];
//     const totalMembers = req.body.users.length;

//     // Generating Ticket ID
//     function generateTicketId() {
//       return Math.floor(10000000 + Math.random() * 90000000); // Generates a random 8-digit number
//     }
//     const ticketId = generateTicketId();

//     // console.log("Ticket ID", ticketId);

//     const newBooking = new Booking({
//       event_id: req.params.eventid,
//       // event_from_date: new Date(),
//       event_from_date: find_event.start_date,
//       // event_to_date: new Date(),
//       event_to_date: find_event.end_date,
//       ticket_id: ticketId,
//       ticket_price: 0,
//       no_of_members: totalMembers,
//       booked_by: "6770c8deba668872f67b794a",
//       booked_at: new Date(),
//       created_at: new Date(),
//       updated_at: new Date(),
//     });

//     const savedBooking = await newBooking.save();

//     // const transporter = nodemailer.createTransport({
//     //   service: 'gmail', // Replace with your service
//     //   auth: {
//     //     user: process.env.EMAIL,
//     //     pass: process.env.PASSWORD,
//     //   },
//     // });

//     const emailPromises = req.body.users.map(async (user, i) => {
//       const pictureFile = req.files ? req.files.find(file => file.fieldname === `users[${i}][pictures]`) : null;

//       const customer_picture = pictureFile ? pictureFile.filename : "";
//       const customer_name = user.names;
//       const customer_email = user.emails;

//       const uniqueCode = `${new Date().getTime()}${Math.floor(10 + Math.random() * 90)}`;
//       const qrCodeFilePath = path.join(qrCodeDirectory, `qrcode_${uniqueCode}.png`);

//       await QRCode.toFile(qrCodeFilePath, uniqueCode, {
//         color: { dark: "#000000", light: '#fbf1e8' },
//         width: 300,
//       });

//       const newBookingDetails = new BookingDetails({
//         customer_picture,
//         customer_name,
//         customer_phone: user.mobile_numbers,
//         customer_email,
//         customer_city: user.cities,
//         customer_organisation: user.organization_names,
//         customer_qr_picture: `qrcode_${uniqueCode}.png`,
//         customer_qr_code: uniqueCode,
//         booking_id: savedBooking._id,
//       });

//       const savedBookingDetails = await newBookingDetails.save();
//       bookingDetailsArray.push(savedBookingDetails);

//       const mailOptions = {
//         from: `"Your Ticket is Successfully Generated - Ready to Go!" <${process.env.EMAIL}>`,
//         to: customer_email,
//         subject: "Event Ticket",
//         html: `
//         <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>India Industrial Fair</title>
//        <style>
//     body {
//       margin: 0;
//       font-family: Arial, sans-serif;
//       background-color: #f7f7f7;
//       color: #333;
//     }
//     .container {
//       max-width: 600px;
//       margin: 0 auto;
//       background: #FBF1E8;
//       border-radius: 10px;
//       box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
//       overflow: hidden;
//       background-image: url('cid:bcakImg');
//       background-position: center;
//       background-size: cover;
//     }
//     .header, .footer {
//       text-align: center;
//       padding: 20px;

//     }
//     .header img {
//       max-width: 80px;
//       height: auto;
//     }
//     .title {
//       font-size: 1.5rem;
//       margin: 10px 0;
//       font-weight: bold;
//     }
//     .date-location {
//       color: #E5552E;
//       font-size: 1.25rem;
//       font-weight: bold;
//       margin: 10px 0;
//     }
//     .visitors-section {
//       text-align: center;
//       border: 2px solid #000;
//       padding: 15px;
//       margin: 15px;
//       border-radius: 10px;
//     }
//     .visitors-section img {
//       max-width: 150px;
//       margin: 10px 0;
//     }
//     .username {
//       font-size: 1.25rem;
//       color: #000;
//       font-weight: bold;
//     }
//     .footer img {
//       max-width: 100px;
//       margin: 10px;
//     }
//     @media (max-width: 768px) {
//       .container {
//         width: 90%;
//       }
//       .title {
//         font-size: 1.25rem;
//       }
//       .date-location {
//         font-size: 1rem;
//       }
//       .visitors-section {
//         font-size: 1rem;
//       }
//     }
//     @media (max-width: 480px) {
//       .header img, .footer img {
//         max-width: 50px;
//       }
//       .title {
//         font-size: 1rem;
//       }
//       .date-location {
//         font-size: 0.875rem;
//       }
//       .visitors-section {
//         font-size: 0.875rem;
//       }
//     }
//   </style>

//     </head>
//     <body>
//         <div class="header">
//             <p> Your Ticket is Successfully Generated! </p>
//         </div>
//         <div class="body">
//             <p>Hi ${user.names},</p>
//             <p>We’re excited to inform you that your ticket has been successfully generated!</p>
//             <p>Here are the details of your ticket:</p>
//             <p>Ticket Code : ${uniqueCode}</p>
//         </div> 


//   <div class="container" style="max-width: 600px; background-image: url('https://drive.google.com/uc?id=1-M3cLGhhJ78HcSXfCmdH4Aak3gyGCcov');
//  background-position: center; background-size: center; border-radius: 10px; margin: auto; padding: 20px; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2); font-family: Arial, sans-serif;">
//   <div class="header" style="text-align: center;">
//     <img src="https://drive.google.com/uc?id=1UNLJL-0nVPBcz5cURnx2EgeyJFXwdt8l" style="width: 60px; height: auto; margin-bottom: 10px;" alt="Logo">
//     <img src="https://drive.google.com/uc?id=18mL0Ew2mq3jytR8ETPodyInBRlO4oX3e" style="width: 220px; height: auto; margin-bottom: 10px;" alt="Event Logo">
//     <img src="https://drive.google.com/uc?id=1HTFMYcBRbLoodWHD87litVfjTexBYjA2" style="width: 120px; height: auto; margin-bottom: 10px;" alt="Make in India">
//     <div class="title" style="font-size: 22px; color: #000000; font-weight: 700; margin: 10px 0;">11TH <span style="color: #E5552E;">INDIA INDUSTRIAL FAIR 2025</span></div>
//     <div class="date-location" style="color: #d9534f; font-size: 22px; font-weight: 900; margin: 15px 0;">10-13 JANUARY</div>
//     <div class="date-location2" style="text-align: center; color: #d9534f; font-size: 22px; font-weight: 900; margin: 15px 0;">
//       <table style="width: 100%; table-layout: fixed;">
//         <tr>
//           <td style="padding: 0;">
//             <img src="https://drive.google.com/uc?id=1YNljTg6BUxpkYSuifIT40SVGJhCnge2V" style="width: 30px; height: auto; vertical-align: middle;" alt="Location">
//             <span style="vertical-align: middle;">DPS GROUND, BHUWANA, UDAIPUR</span>
//           </td>
//         </tr>
//       </table>
//     </div>
//   </div>

//   <div class="visitors-section" style="border: 3px solid #000; border-radius: 10px; background-color: #FBF1E8; padding: 15px; text-align: center; font-weight: bold; font-size: 20px; margin: 15px auto; max-width: 70%;">
//     <div class="heading" style="font-size: 24px; font-weight: 900; color: #000000;">VISITORS</div>
//     <img src="cid:qrcode" style="margin-top: 10px;" alt="QR Code">
//     <div class="username" style="font-size: 18px; font-weight: 900; color: #000000; margin-top: 10px;">${user.names}</div>
//   </div>

//  <div class="footer" style="text-align: center; margin-top: 20px;">
//   <div class="title" style="font-size: 22px; color: #000000; font-weight: 700;">OUR SPONSOR</div>
//   <table align="center" style="width: 100%; margin-top: 20px; table-layout: fixed; border-collapse: collapse;">
//     <tr>
//       <td align="center" style="padding: 5px; width: 25%;">
//         <img src="https://drive.google.com/uc?id=1kWVaYw0ojamvyzvmdUGDRQ5MeZHKGS7R" style="max-width: 100px; width: 80%; height: auto;" alt="Sponsor 1">
//       </td>
//       <td align="center" style="padding: 5px; width: 25%;">
//         <img src="https://drive.google.com/uc?id=1ehN4JFPfkyEhoVB9zoY7jVW4hxrHOs_U" style="max-width: 100px; width: 80%; height: auto;" alt="Sponsor 2">
//       </td>
//       <td align="center" style="padding: 5px; width: 25%;">
//         <img src="https://drive.google.com/uc?id=1Sg4RAbXXztikhIXqefNr4TY5OEDanX5K" style="max-width: 100px; width: 80%; height: auto;" alt="Sponsor 3">
//       </td>
//       <td align="center" style="padding: 5px; width: 25%;">
//         <img src="https://drive.google.com/uc?id=1uyNOUzrl6V-WF0CwpJlxMJJ0Ao6Lyc7p" style="max-width: 100px; width: 80%; height: auto;" alt="Sponsor 4">
//       </td>
//     </tr>
//   </table>
// </div>

// </div>


//     </body>
//     </html>
//         `, // Your email HTML content
//         attachments: [
//           {
//             filename: `qrcode_${uniqueCode}.png`,
//             path: qrCodeFilePath,
//             cid: 'qrcode',
//           },
//         ],
//       };

//       return transporter.sendMail(mailOptions);
//       // await Promise.all(req.body.users.map(user => transporter.sendMail(mailOptions)));
//     });

//     await Promise.all(emailPromises);

//     res.status(200).json({
//       message: "Booking successful, emails sent!",
//       booking: savedBooking,
//       details: bookingDetailsArray,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


function generateTicketHTML(user, uniqueCode, qrCodeFilePath) {
  return `
 <!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }

    .ticket {
      width: 100%;
      max-width: 800px;
      margin: 20px auto;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }

    .ticket-left,
    .ticket-right {
      padding: 20px;
    }

    .ticket-left {
      background-color: #FFE5D2;
      border-right: 1px dashed #ddd;
    }

    .ticket-header {
      text-align: center;
      margin-bottom: 20px;
    }

    .ticket-header img {
      height: 50px;
      width: auto;
      margin: 5px;
    }

    .event-title h1 {
      font-size: 24px;
      margin-bottom: 10px;
      color: #333;
    }

    .event-description {
      font-size: 14px;
      margin-bottom: 20px;
      color: #555;
    }

    .event-timing {
      display: inline-block;
      margin-bottom: 10px;
      font-weight: bold;
      font-size: 14px;
    }

    .event-location {
      font-size: 14px;
      margin-bottom: 20px;
      color: #555;
    }

    .row {
      display: table;
      width: 100%;
    }

    .col-6 {
      width: 50%;
      display: table-cell;
      padding-right: 10px;
    }

    .col-6 p {
      margin: 5px 0;
      color: #555;
    }

    .ticket-right {
      background-color: #fafafa;
      text-align: center;
    }

    .admit-one {
      font-weight: bold;
      margin-bottom: 20px;
    }

    .qr-code {
      margin-bottom: 20px;
    }

    .qr-code img {
      width: 150px;
      height: 150px;
    }

    .ticket-code {
      font-weight: bold;
      margin-bottom: 10px;
    }

    .download-btn {
      display: inline-block;
      padding: 10px 20px;
      background-color: #ff5722;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
    }

    /* Mobile responsive */
    @media only screen and (max-width: 600px) {
      .ticket {
        width: 100%;
      }

      .ticket-left,
      .ticket-right {
        padding: 15px;
        width: 100%;
        border-right: none;
      }

      .ticket-header img {
        width: 100%;
        height: auto;
      }

      .row {
        display: block;
        width: 100%;
      }

      .col-6 {
        width: 100%;
        display: block;
        padding-right: 0;
        margin-bottom: 10px;
      }

      .event-title h1 {
        font-size: 20px;
      }

      .event-description,
      .event-timing,
      .event-location {
        font-size: 12px;
      }

      .qr-code img {
        width: 120px;
        height: 120px;
      }

      .ticket-code {
        font-size: 14px;
      }
    }
  </style>
</head>
<body>
  <div class="ticket">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td class="ticket-left" width="65%">
          <div class="ticket-header">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="32%" style="text-align: center; padding: 5px;">
                  <img src="https://drive.google.com/uc?id=1UNLJL-0nVPBcz5cURnx2EgeyJFXwdt8l" alt="Logo 1">
                </td>
                <td width="32%" style="text-align: center; padding: 5px;">
                  <img src="https://drive.google.com/uc?id=18mL0Ew2mq3jytR8ETPodyInBRlO4oX3e" alt="Logo 2">
                </td>
                <td width="32%" style="text-align: center; padding: 5px;">
                  <img src="https://drive.google.com/uc?id=1HTFMYcBRbLoodWHD87litVfjTexBYjA2" alt="Logo 3">
                </td>
              </tr>
            </table>
          </div>

          <div class="event-title">
            <h1>India Industrial Fair 2025 Udaipur</h1>
          </div>

          <p class="event-description">
            The 11th India Industrial Fair (IIF) 2025 will be held from January 10 to 13, 2025, at the DPS Ground in Udaipur. Hosted by Laghu Udyog Bharti (LUB).
          </p>

          <div class="event-timing">
            <p>10th Jan, 2025 09:00 AM | 13th Jan, 2025 10:00 PM IST</p>
          </div>

          <p class="event-location">DPS School Ground, Bhuwana, Udaipur, Rajasthan 313001</p>

          <div class="row">
            <div class="col-6">
              <p><strong>Name:</strong> ${user.names}</p>
              <p><strong>Email:</strong> ${user.emails}</p>
              <p><strong>Organization:</strong> ${user.organization_names}</p>
            </div>
            <div class="col-6">
              <p><strong>Mobile No:</strong> ${user.mobile_numbers}</p>
              <p><strong>City:</strong> ${user.cities}</p>
            </div>
          </div>
        </td>

        <td class="ticket-right" width="35%">
          <p class="admit-one">Scan Me</p>
          <div class="qr-code">
            <img src="cid:qrcode" alt="QR Code">
          </div>
          <p class="ticket-code">Ticket Code</p>
          <p class="ticket-code">${uniqueCode}</p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>



`;


}
const eventBooking = async (req, res) => {
  try {
    const find_event = await Event.findById(req.params.eventid).select('start_date end_date');

    const qrCodeDirectory = path.join(__dirname, '../uploads', 'qrCode');
    // console.log("dir", qrCodeDirectory)
    await createDirectory(qrCodeDirectory);

    const bookingDetailsArray = [];
    const totalMembers = req.body.users.length;

    const ticketId = generateTicketId();
    const newBooking = new Booking({
      event_id: req.params.eventid,
      event_from_date: find_event.start_date,
      event_to_date: find_event.end_date,
      ticket_id: ticketId,
      ticket_price: 0,
      no_of_members: totalMembers,
      booked_by: "6770c8deba668872f67b794a",
      booked_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedBooking = await newBooking.save();



    const emailPromises = req.body.users.map(async (user, i) => {
      // Extracting user details
      const pictureFile = req.files ? req.files.find(file => file.fieldname === `users[${i}][pictures]`) : null;
      const customer_picture = pictureFile ? pictureFile.filename : "";
      const customer_name = user.names;
      const customer_email = user.emails;

      // Generate unique code
      const uniqueCode = `${new Date().getTime()}${Math.floor(10 + Math.random() * 90)}`;

      // Create QR code in parallel
      const qrCodePromise = createQRCode(uniqueCode, qrCodeDirectory).then(qrCodeFilePath => ({
        qrCodeFilePath,
        uniqueCode
      }));

      const newBookingDetails = new BookingDetails({
        customer_picture,
        customer_name,
        customer_phone: user.mobile_numbers,
        customer_email,
        customer_city: user.cities,
        customer_organisation: user.organization_names,
        customer_qr_picture: `qrcode_${uniqueCode}.png`,
        customer_qr_code: uniqueCode,
        booking_id: savedBooking._id,
        event_id: req.params.eventid
      });

      const savedBookingDetails = await newBookingDetails.save();
      bookingDetailsArray.push(savedBookingDetails);

      // Wait for QR code generation
      const { qrCodeFilePath } = await qrCodePromise;

      // Prepare the mail options
      const mailOptions = {
        from: process.env.EMAIL,
        to: customer_email,
        subject: "Event Ticket",
        html: generateTicketHTML(user, uniqueCode, qrCodeFilePath),
        attachments: [
          {
            filename: `qrcode_${uniqueCode}.png`,
            path: qrCodeFilePath,
            cid: 'qrcode',
          },
        ],
      };
      // console.time("sendEmail");
      return sendEmail(mailOptions);
      // console.timeEnd("sendEmail");
    });

    await Promise.all(emailPromises);

    res.status(200).json({
      message: "Booking successful, emails sent!",
      booking: savedBooking,
      details: bookingDetailsArray,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// const showUserDatas = async (req, res) => {
//   try {
//     // getting user id from token
//     const user_id = req.user.sub
//     console.log("user id from auth", user_id) //
//     console.log("*******", req.params.code)

//     return res.status(200).json({ success: true, message: "User Details found" });




//     // Finding the User Booking Details : 
//     // const eventBooking = await EventBookingNews.findOne({ "customer_qr_code": req.params.id });
//     const eventBooking = await BookingDetails.findOne({ customer_qr_code: req.params.code });
//     console.log(eventBooking, "---------------eventBooking---------------");

//     // If No Data Found
//     if (!eventBooking) {
//       return res.status(404).json({ message: "Event booking not found" });
//     }

//     console.log(eventBooking.booking_id, "---------------eventBooking.booking_id---------------");
//     const check_data = await Booking.findById({ _id: eventBooking.booking_id })
//     // const check_data = await Booking.findOne({ _id: new ObjectId(eventBooking.booking_id) });

//     // console.log("cehck data", check_data)
//     console.log("cehck dsaat", check_data.event_from_date,event_from_date.event_to_date)

//     // const currentTime = new Date();
//     const currentTime = new Date('2024-12-27T12:00:00.000Z');
//     const event_from_date = new Date('2024-12-25T15:00:00.000Z');
//     const event_to_date = new Date('2024-12-31T28:00:00.000Z');
//     if (currentTime < event_from_date || currentTime > event_to_date) {
//       return res.status(400).json({ success: false, message: "Event has expired or not started yet" });
//     }

//     if (eventBooking.customer_qr_code.toString() !== req.params.code.toString()) {
//       // if (eventBooking.customer_qr_code !== req.params.code) {
//       // console.log("gggggg")
//       return res.status(400).json({ success: true, message: "QR Code not matched, not valid" })
//     }

//     // success message
//     return res.status(200).json({ success: true, message: "User details found", eventBooking });
//   } catch (error) {
//     // console.error(error);
//     return res.status(500).json({ message: "Error fetching user details", error });
//   }

// }
const showUserData = async (req, res) => {
  try {
    // getting user id from token
    const user_id = req.user.sub;
    // console.log("User ID from auth:", user_id);
    // console.log("QR Code from params:", req.params.code);

    // Step 1: Finding the User Booking Details
    const eventBooking = await BookingDetails.findOne({ customer_qr_code: req.params.code });
    // console.log("Event Booking details:", eventBooking);

    // If no data found for event booking
    if (!eventBooking) {
      return res.status(404).json({ status: 404, message: "Event booking not found" });
    }

    // Step 2: Fetching the related Booking details using booking_id from eventBooking
    const check_data = await Booking.findById(eventBooking.booking_id);
    // console.log("Booking details:", check_data);

    // Step 3: Validating event dates
    const currentTime = new Date(); // Replace with dynamic current time
    // const currentTime = new Date('2025-03-27T12:00:00.000Z');
    // const event_from_date = new Date('2024-12-25T15:00:00.000Z');
    const event_from_date = check_data.event_from_date;
    // const event_to_date = new Date('2024-12-31T28:00:00.000Z');
    const event_to_date = check_data.event_to_date;

    if (currentTime < event_from_date) {
      return res.status(400).json({ status: 400, success: false, message: "Event does not started yet" });
    }

    if (currentTime > event_to_date) {
      return res.status(400).json({ status: 400, success: false, message: "Event has been expired" });
    }

    // Step 4: Validating the QR code
    if (eventBooking.customer_qr_code.toString() !== req.params.code.toString()) {
      return res.status(400).json({ status: 400, success: false, message: "QR Code does not match" });
    }

    if (eventBooking.is_cancelled === false) {
      eventBooking.is_cancelled = true
      await eventBooking.save()
      return res.status(200).json({ status: 200, success: true, message: "The user entry has been allowed", eventBooking });
    }
    else {
      return res.status(400).json({ status: 400, success: false, message: "User already entered into the event", eventBooking });
    }



    // Step 5: Returning the success response with event booking details
    // return res.status(200).json({ success: true, message: "User details found", eventBooking });

  } catch (error) {
    // console.error("Error fetching user details:", error);
    return res.status(500).json({ message: "Error fetching user details", error });
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
    res.status(200).json({ success: true, message: "Entry Updated.", eventBooking })

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
      success: true,
      message: "Event details added successfully",
      data: savedEventDetails,
    });
  } catch (error) {
    console.error("Error adding event details:", error);
    res.status(500).json({ error: "Internal server error" });
  }

}



module.exports = { deleteEventType, createEventType, getEventType, getEventInfo, updateEventType, getEventTypeByID, eventBooking, eventDetails, showUserData, updateEntry }