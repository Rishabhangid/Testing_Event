const { EventType } = require("../models");

const EventBooking = require("../models/eventBookingSchema");
const EventDetails = require("../models/eventDetailsSchema");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
// const QRCode = require('qrcode');
const QRCode = require('qrcode');
const fs = require('fs');
const EventBookingNews = require("../models/eventBookingSchemas");
// const EventBookingNew = require("../models/eventBookingSchemas");


const path = require("path"); // Import path for handling file paths

const nodemailer = require('nodemailer');
const Customer = require("../models/customerSchema");
const { tokenService } = require("../service");
// Email configuration to send qr codeon email
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use another email service
  auth: {
    user: process.env.EMAIL, // Replace with your email
    pass: process.env.PASSWORD, // Use app password if using Gmail
  },
});



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
const registerCustomer = async (req, res) => {
  const { first_name, last_name, email, number, password, passwordcnfrm } = req.body;

  console.log("data", req.body);

  try {
    // Validation
    if (!first_name || !last_name || !email || !number || !password || !passwordcnfrm) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate if passwords match
    if (password !== passwordcnfrm) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Check if the email already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new customer
    const newCustomer = new Customer({
      first_name,
      last_name,
      email,
      number,
      password: hashedPassword,
    });

    const user = await tokenService.generateAuthTokens(newCustomer);

    // Save the customer
    await newCustomer.save();

    console.log("Customer Registered.");
    res.status(201).json({ message: "Customer registered successfully", data: user });
  } catch (error) {
    console.error("Error registering customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



// Login Customer
const loginCustomer = async (req, res) => {
  const { email, password } = req.body;
  console.log("data", email, password);

  try {
    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if the customer exists
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    // Generate a JWT token (optional, if using JWT for authentication)
    // const token = jwt.sign(
    //   { id: customer._id, email: customer.email },
    //   process.env.JWT_SECRET,
    //   { expiresIn: process.env.JWT_ACCESS_EXPIRATION_MINUTES }
    // );
    const user = await tokenService.generateAuthTokens(customer)

    // Successful login response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: user, // Optional: Include the token if you're using JWT
    });
  } catch (error) {
    console.error("Error logging in customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }

};




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
// const eventBooking = async (req, res) => {
//   try {
//     const { users } = req.body;
//     console.log("************ Users from front", req.body);
//     console.log(req.files, "---------------req.files---------------");

//     // Normalize file paths and include them in the file objects
//     const files = req.files.map((file) => {
//       return {
//         ...file,
//         normalizedPath: file.path.replace(/\\/g, "/"), // Replace backslashes with forward slashes
//       };
//     });

//     console.log("************ Files with normalized paths", files);

//     const filePaths = req.files.map(file => path.normalize(file.path));
//     console.log("Normalized file paths:", filePaths);

//     // Validate users array
//     if (!users || users.length === 0) {
//       return res.status(400).json({
//         error: "Users array is empty.",
//       });
//     }

//     // Prepare users array with required fields
//     const usersArray = users.map((user, index) => {
//       if (!user.names || !user.mobile_numbers || !user.emails) {
//         throw new Error("Missing required fields for user at index " + index);
//       }

//       // Define file name for each user's picture
//       const pictureFile = files.find(file => file.fieldname === `users[${index}][pictures]`);

//       // const pictureFile = req.files.find(
//       //   (file) => file.fieldname === `users[${index}][pictures]`
//       // );

//       if (!pictureFile) {
//         throw new Error("Picture file missing for user at index " + index);
//       }
//       console.log("**************************** Picture File:", pictureFile);

//       return {
//         // pictures: pictureFile.normalizedPath,
//         pictures: pictureFile.filename,
//         names: user.names,
//         mobile_numbers: user.mobile_numbers,
//         emails: user.emails,
//         organization_names: user.organization_names,
//         cities: user.cities,
//         created_at: new Date(),
//         updated_at: new Date(),
//       };
//     });

//     console.log("*************** users experi", usersArray)

//     // Save event booking without QR codes
//     const savedEventBooking = new EventBookingNews({
//       users: usersArray,
//     });
//     await savedEventBooking.save();

//     // Directory to store QR Codes
//     const qrCodeDirectory = path.join(__dirname, '../uploads', 'qrCode');

//     // Ensure QR Code directory exists
//     const fs = require('fs');
//     if (!fs.existsSync(qrCodeDirectory)) {
//       fs.mkdirSync(qrCodeDirectory, { recursive: true });
//     }

//     // Generate QR codes and send emails
//     const updatedUsersArray = await Promise.all(savedEventBooking.users.map(async (user, index) => {
//       const userId = user._id; // MongoDB ObjectId for each user

//       // Generate QR code file path
//       const qrCodeFilePath = path.join(qrCodeDirectory, `qrcode_${index}_${userId}.png`);
//       const fileName = path.basename(qrCodeFilePath);
//       console.log("*****&&&&&&",fileName); // Outputs: qrcode_<index>_<userId>.png

//       console.log("****ye he", qrCodeFilePath)

//       // Generate QR code
//       await QRCode.toFile(qrCodeFilePath, `${userId}`, {
//         color: {
//           dark: '#000000',
//           light: '#fbf1e8',
//         },
//         width: 300,
//       });
//       // console.log(QRCode, "---------------QRCODE new---------------");

//       // Update user object with QR code path
//       // user.qr_code = path.relative(path.join(__dirname, '../../'), qrCodeFilePath);

//       const projectRoot = path.join(__dirname, '../../'); // Define project root

//       // const projectRoot = path.join(__dirname, '../../').replace('/src', '');

//       // user.qr_code = path.relative(projectRoot, qrCodeFilePath).replace(/\\/g, "/");
//       user.qr_code = fileName;

//       console.log("to sne ",user.qr_code)

//       // try 1
//       // Normalize the QR code path for browser access
//       // const normalizedQrCodePath = qrCodeFilePath.replace(/\\/g, "/");
//       // console.log("***********normalized qr", normalizedQrCodePath)

//       // // Update user object with QR code path
//       // user.qr_code = normalizedQrCodePath;





//       // Send email with QR code
//       // await transporter.sendMail({
//       //   from: '"Event Booking Confirmation" <your-email@gmail.com>',
//       //   to: user.emails,
//       //   subject: "Your Event QR Code",
//       //   html: `<!DOCTYPE html>
//       //     <html lang="en">
//       //     <head>
//       //       <meta charset="UTF-8">
//       //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       //       <title>Event QR Code</title>
//       //     </head>
//       //     <body>
//       //       <div>
//       //         <h1>Hello ${user.names},</h1>
//       //         <p>Here is your QR code for the event:</p>
//       //         <img src="cid:qrcode" alt="QR Code"/>
//       //       </div>
//       //     </body>
//       //     </html>`,
//       //   attachments: [
//       //     {
//       //       filename: `qrcode_${index}.png`,
//       //       path: qrCodeFilePath, // Attach the generated QR code
//       //       cid: 'qrcode',
//       //     },
//       //   ],
//       // });

//       await transporter.sendMail({
//         from: '"Event Booking Confirmation" <your-email@gmail.com>', // Sender address
//         to: user.emails, // Recipient email
//         subject: "Your Event QR Code",
//         text: `Hello ${user.names},\n\nHere is your QR code for the event.`,
//         html: `
//           <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>India Industrial Fair</title>
//       <style>
//         :root {
//           font-size: 16px; /* Base font size */
//         }

//         body {
//           margin: 0;
//           font-family: Arial, sans-serif;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           min-height: 100vh;
//         }

//         .tocenter {
//           display: flex;
//           justify-content: center;
//         }

//         .container {
//           max-width: 600px;
//           background: #fff;
//           background-color: #FBF1E8;

//           border-radius: 0.625rem; /* 10px */
//           box-shadow: 0 0.125rem 0.3125rem rgba(0, 0, 0, 0.2); /* 2px 5px */
//         }

//         .header, .footer {
//           text-align: center;
//         }

//         .header img {
//           width: 5rem; /* 80px */

//         }

//         .title {
//           font-size: 1.375rem; /* 22px */
//           color : #000000;
//           font-weight: 700;
//           margin: 0.625rem 0; /* 10px */
//         }

//         .mainlogo {
//             width: 120px;
//           }

//         .title2 {
//           color: #E5552E;
//         }

//         .date-location {
//           color: #d9534f;
//           font-size: 1.375rem; /* 22px */
//           font-weight: 900;
//           margin: 0.9375rem 0; /* 15px */
//         }

//         .date-location2 {

//           display: flex;
//           justify-content: center;
//           align-items: center;
//           color: #d9534f;
//           font-size: 1.375rem; /* 22px */
//           font-weight: 900;
//           margin: 0.9375rem 0; /* 15px */
//         }

//         .loc {
//           width: 1.875rem; /* 30px */
//           height: auto;
//         }

//         .visitors-section {


//            border: 0.1875rem solid #000; /* 3px */
//            background-color: #FBF1E8;
//            border-radius: 0.625rem; /* 10px */
//            padding: 0.9375rem; /* 15px */
//            margin: 0.9375rem 0; /* 15px */
//            text-align: center;
//            font-weight: bold;
//            font-size: 1.25rem; /* 20px */
//            width: 70%; /* Set the width to 70% */
//            margin-left: auto; /* Center the section */
//            margin-right: auto; /* Center the section */
//         }



//         .line {
//           border: 1px
//         }

//         .heading {
//           font-weight: 900;
//           font-size: 1.5rem; /* 20px */
//           color : #000000;
//         }

//         .username {
//           font-weight: 900;
//           color : #000000;
//         }

//         .sponsors {
//           display: flex;
//           flex-wrap: wrap;
//           justify-content: space-between;
//           gap: 0.625rem; /* 10px */
//           margin-top: 1.25rem; /* 20px */
//         }

//         .sponsors img {
//           max-width: 6.25rem; /* 100px */
//           height: auto;
//           flex-shrink: 0;
//         }

//         @media (max-width: 768px) {
//           :root {
//             font-size: 14px; /* Scale down base font size */
//           }

//           .container {
//             width: 90%;
//           }

//           .mainlogo {
//             width: 120px;
//           }

//           .title {
//             font-size: 1.25rem; /* Slightly smaller for smaller screens */
//             color : #000000;
//           }

//           .date-location, .date-location2 {
//             font-size: 1.25rem;
//           }

//           .visitors-section {
//             font-size: 1.125rem; /* Smaller font size */
//           }
//         }

//         @media (max-width: 480px) {
//           :root {
//             font-size: 12px; /* Further scale down for very small screens */
//           }

//           .header img {
//             width: 3.75rem; /* Smaller logos for narrow screens */
//           }

//           .title, .date-location, .date-location2 {
//             font-size: 1rem; /* Reduce text size for better fit */
//             color : #000000;
//           }

//           .visitors-section {
//             font-size: 1rem;
//           }

//           .sponsors img {
//             max-width: 5rem; /* 80px */
//           }


//         }
//       </style>
//     </head>
//     <body>
//         <div class="container" style="background-image: url('cid:bcakImg'); background-position: center; background-size: center;">
//           <div class="header">
//             <div>
//               <img src="cid:logo" style="width: 60px; height: auto;" alt="Logo">
//               <img src="cid:event"  style="width: 220px; height: auto;" alt="Logo" class="mainlogo" alt="Logo">
//               <img src="cid:india"  style="width: 120px; height: auto;" alt="Logo" alt="Logo">
//             </div>
//             <div class="title">11TH <span class="title2">INDIA INDUSTRIAL FAIR 2025</span></div>
//             <div class="date-location">10-13 JANUARY</div>

//             <div class="date-location2" style="text-align: center;">
//              <table role="presentation" style="width: 100%; table-layout: fixed; text-align: center;">
//                <tr>
//                  <td style="padding: 0; vertical-align: middle;">
//                    <img src="cid:location" class="loc" style="width: 30px; height: 30px; object-fit: cover; vertical-align: middle;" alt="location"/>
//                    <span style="vertical-align: middle;">DPS GROUND, BHUWANA, UDAIPUR</span>
//                  </td>
//                 </tr>
//              </table>
//             </div>
//           </div>

//           <div class="visitors-section">
//             <div class="heading">VISITORS</div>
//             <img src="cid:qrcode" alt="QR Code"/>
//             <div class="username">${user.names}</div>
//           </div>
//           <div class="line"></div>
//           <div class="footer">
//            <div class="title">OUR SPONSOR</div>
//            <div style="text-align: center; margin-top: 20px;">
//             <table align="center" style="width: 100%; border-spacing: 0; border-collapse: collapse;">
//               <tr>
//                 <td align="center" style="">
//                   <img src="cid:sponsor1" alt="Sponsor 1" style="width: 100px; height: auto;">
//                 </td>
//                 <td align="center" style="">
//                   <img src="cid:sponsor2" alt="Sponsor 2" style="width: 100px; height: auto;">
//                 </td>
//                 <td align="center" style="">
//                   <img src="cid:sponsor3" alt="Sponsor 3" style="width: 100px; height: auto;">
//                 </td>
//                 <td align="center" style="">
//                   <img src="cid:sponsor4" alt="Sponsor 4" style="width: 100px; height: auto;">
//                 </td>
//               </tr>
//             </table>
//          </div>

//           </div>
//         </div>

//     </body>
//     </html>
//         `,
//         attachments: [
//           {
//             filename: `qrcode_${index}.png`,
//             path: qrCodeFilePath,
//             cid: 'qrcode'
//           },

//           {
//             filename: 'lubnew.png',
//             // path: '../static_img/lub.png',
//             path: './src/static_img/lubnew.png',

//             cid: 'logo'
//           },
//           {
//             filename: 'Groupp.png',
//             // path: '../static_img/lub.png',
//             path: './src/static_img/Groupp.png',

//             cid: 'bcakImg'
//           },

//           { // fair
//             filename: 'removedbgimg.png',
//             // path: '../static_img/fair.png',
//             path: './src/static_img/removedbgimg.png',
//             cid: 'event'
//           },
//           { // make in india
//             filename: 'makeinindianew.png',
//             // path: '../static_img/makeinindia.png', 
//             path: './src/static_img/makeinindianew.png',
//             cid: 'india' // This is the unique Content-ID for the logo image
//           },
//           { // location
//             filename: 'locationnew.png',
//             // path: '../static_img/makeinindia.png', 
//             path: './src/static_img/locationnew.png',
//             cid: 'location' // This is the unique Content-ID for the logo image
//           },
//           {
//             filename: 'miraj2.png',
//             // path: '../static_img/miraj.png', 
//             path: './src/static_img/miraj2.png',
//             cid: 'sponsor1'
//           },
//           {
//             filename: 'anantanew.png',
//             // path: '../static_img/ananta.png',
//             path: './src/static_img/anantanew.png',
//             cid: 'sponsor2'
//           },
//           {
//             filename: 'iveonew.png',
//             // path: '../static_img/iveo.png',
//             path: './src/static_img/ievonew.png',
//             cid: 'sponsor3'
//           },
//           {
//             filename: 'wondernew.png',
//             // path: '../static_img/wonder.png',
//             path: './src/static_img/wondernew.png',
//             cid: 'sponsor4'
//           }
//         ],
//       });

//       return user;
//     }));

//     // Respond with success message
//     res.status(200).json({
//       message: "Event booking completed successfully.",
//       eventBooking: savedEventBooking,
//     });

//   } catch (error) {
//     console.error("Error processing event booking:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

const eventBooking = async (req, res) => {
  try {
    const { users } = req.body;
    // console.log("Users from front", req.body);
    // console.log(req.files, "req.files");

    const files = req.files.map((file) => ({
      ...file,
      normalizedPath: file.path.replace(/\\/g, "/"),
    }));

    // console.log("Files with normalized paths", files);

    const filePaths = req.files.map(file => path.normalize(file.path));
    // console.log("Normalized file paths:", filePaths);

    if (!users || users.length === 0) {
      return res.status(400).json({ error: "Users array is empty." });
    }

    const usersArray = users.map((user, index) => {
      if (!user.names || !user.mobile_numbers || !user.emails) {
        throw new Error("Missing required fields for user at index " + index);
      }

      const pictureFile = files.find(file => file.fieldname === `users[${index}][pictures]`);
      if (!pictureFile) {
        throw new Error("Picture file missing for user at index " + index);
      }

      return {
        pictures: pictureFile.filename,
        names: user.names,
        mobile_numbers: user.mobile_numbers,
        emails: user.emails,
        organization_names: user.organization_names,
        cities: user.cities,
        created_at: new Date(),
        updated_at: new Date(),
      };
    });

    // console.log("Users array:", usersArray);

    const savedEventBooking = new EventBookingNews({ users: usersArray });
    await savedEventBooking.save();

    const qrCodeDirectory = path.join(__dirname, '../uploads', 'qrCode');
    if (!fs.existsSync(qrCodeDirectory)) {
      fs.mkdirSync(qrCodeDirectory, { recursive: true });
    }

    const emailPromises = savedEventBooking.users.map(async (user, index) => {
      const userId = user._id;
      const qrCodeFilePath = path.join(qrCodeDirectory, `qrcode_${index}_${userId}.png`);
      await QRCode.toFile(qrCodeFilePath, `${userId}`, {
        color: { dark: '#000000', light: '#fbf1e8' },
        width: 300,
      });

      const fileName = path.basename(qrCodeFilePath);
      user.qr_code = fileName;

      await transporter.sendMail({
        from: '"Event Booking Confirmation" <your-email@gmail.com>',
        to: user.emails,
        subject: "Your Event QR Code",
        text: `Hello ${user.names},\n\nHere is your QR code for the event.`,
        html: `          <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>India Industrial Fair</title>
      <style>
        :root {
          font-size: 16px; /* Base font size */
        }

        body {
          margin: 0;
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }

        .tocenter {
          display: flex;
          justify-content: center;
        }

        .container {
          max-width: 600px;
          background: #fff;
          background-color: #FBF1E8;
          
          border-radius: 0.625rem; /* 10px */
          box-shadow: 0 0.125rem 0.3125rem rgba(0, 0, 0, 0.2); /* 2px 5px */
        }

        .header, .footer {
          text-align: center;
        }

        .header img {
          width: 5rem; /* 80px */
         
        }

        .title {
          font-size: 1.375rem; /* 22px */
          color : #000000;
          font-weight: 700;
          margin: 0.625rem 0; /* 10px */
        }

        .mainlogo {
            width: 120px;
          }

        .title2 {
          color: #E5552E;
        }

        .date-location {
          color: #d9534f;
          font-size: 1.375rem; /* 22px */
          font-weight: 900;
          margin: 0.9375rem 0; /* 15px */
        }

        .date-location2 {
         
          display: flex;
          justify-content: center;
          align-items: center;
          color: #d9534f;
          font-size: 1.375rem; /* 22px */
          font-weight: 900;
          margin: 0.9375rem 0; /* 15px */
        }
          .header { 
          margin-top: 0.1875rem 0; /* 15px */
          }

        .loc {
          width: 1.875rem; /* 30px */
          height: auto;
        }

        .visitors-section {
        

           border: 0.1875rem solid #000; /* 3px */
           background-color: #FBF1E8;
           border-radius: 0.625rem; /* 10px */
           padding: 0.9375rem; /* 15px */
           margin: 0.9375rem 0; /* 15px */
           text-align: center;
           font-weight: bold;
           font-size: 1.25rem; /* 20px */
           width: 70%; /* Set the width to 70% */
           margin-left: auto; /* Center the section */
           margin-right: auto; /* Center the section */
        }

         

        .line {
          border: 1px
        }

        .heading {
          font-weight: 900;
          font-size: 1.5rem; /* 20px */
          color : #000000;
        }

        .username {
          font-weight: 900;
          color : #000000;
        }

        .sponsors {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 0.625rem; /* 10px */
          margin-top: 1.25rem; /* 20px */
        }

        .sponsors img {
          max-width: 6.25rem; /* 100px */
          height: auto;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          :root {
            font-size: 14px; /* Scale down base font size */
          }

          .container {
            width: 90%;
          }

          .mainlogo {
            width: 120px;
          }

          .title {
            font-size: 1.25rem; /* Slightly smaller for smaller screens */
            color : #000000;
          }

          .date-location, .date-location2 {
            font-size: 1.25rem;
          }

          .visitors-section {
            font-size: 1.125rem; /* Smaller font size */
          }
        }

        @media (max-width: 480px) {
          :root {
            font-size: 12px; /* Further scale down for very small screens */
          }

          .header img {
            width: 3.75rem; /* Smaller logos for narrow screens */
          }

          .title, .date-location, .date-location2 {
            font-size: 1rem; /* Reduce text size for better fit */
            color : #000000;
          }

          .visitors-section {
            font-size: 1rem;
          }

          .sponsors img {
            max-width: 5rem; /* 80px */
          }

         
        }
      </style>
    </head>
    <body>
        <div class="container" style="background-image: url('cid:bcakImg'); background-position: center; background-size: center;">
          <div class="header" style="margin-top: 20px;">
            <div>
              <img src="cid:logo" style="width: 60px; height: auto;" alt="Logo">
              <img src="cid:event"  style="width: 220px; height: auto;" alt="Logo" class="mainlogo" alt="Logo">
              <img src="cid:india"  style="width: 120px; height: auto;" alt="Logo" alt="Logo">
            </div>
            <div class="title">11TH <span class="title2">INDIA INDUSTRIAL FAIR 2025</span></div>
            <div class="date-location">10-13 JANUARY</div>

            <div class="date-location2" style="text-align: center;">
             <table role="presentation" style="width: 100%; table-layout: fixed; text-align: center;">
               <tr>
                 <td style="padding: 0; vertical-align: middle;">
                   <img src="cid:location" class="loc" style="width: 30px; height: 30px; object-fit: cover; vertical-align: middle;" alt="location"/>
                   <span style="vertical-align: middle;">DPS GROUND, BHUWANA, UDAIPUR</span>
                 </td>
                </tr>
             </table>
            </div>
          </div>

          <div class="visitors-section">
            <div class="heading">VISITORS</div>
            <img src="cid:qrcode" alt="QR Code"/>
            <div class="username">${user.names}</div>
          </div>
          <div class="line"></div>
          <div class="footer">
           <div class="title">OUR SPONSOR</div>
           <div style="text-align: center; margin-top: 20px;">
            <table align="center" style="width: 100%; border-spacing: 0; border-collapse: collapse;">
              <tr>
                <td align="center" style="">
                  <img src="cid:sponsor1" alt="Sponsor 1" style="width: 100px; height: auto;">
                </td>
                <td align="center" style="">
                  <img src="cid:sponsor2" alt="Sponsor 2" style="width: 100px; height: auto;">
                </td>
                <td align="center" style="">
                  <img src="cid:sponsor3" alt="Sponsor 3" style="width: 100px; height: auto;">
                </td>
                <td align="center" style="">
                  <img src="cid:sponsor4" alt="Sponsor 4" style="width: 100px; height: auto;">
                </td>
              </tr>
            </table>
         </div>

          </div>
        </div>
      
    </body>
    </html>`, // HTML content here

        attachments: [
          {
            filename: `qrcode_${index}.png`,
            path: qrCodeFilePath,
            cid: 'qrcode'
          },

          {
            filename: 'lubnew.png',
            // path: '../static_img/lub.png',
            path: './src/static_img/lubnew.png',

            cid: 'logo'
          },
          {
            filename: 'Groupp.png',
            // path: '../static_img/lub.png',
            path: './src/static_img/Groupp.png',

            cid: 'bcakImg'
          },

          { // fair
            filename: 'removedbgimg.png',
            // path: '../static_img/fair.png',
            path: './src/static_img/removedbgimg.png',
            cid: 'event'
          },
          { // make in india
            filename: 'makeinindianew.png',
            // path: '../static_img/makeinindia.png', 
            path: './src/static_img/makeinindianew.png',
            cid: 'india' // This is the unique Content-ID for the logo image
          },
          { // location
            filename: 'locationnew.png',
            // path: '../static_img/makeinindia.png', 
            path: './src/static_img/locationnew.png',
            cid: 'location' // This is the unique Content-ID for the logo image
          },
          {
            filename: 'miraj2.png',
            // path: '../static_img/miraj.png', 
            path: './src/static_img/miraj2.png',
            cid: 'sponsor1'
          },
          {
            filename: 'anantanew.png',
            // path: '../static_img/ananta.png',
            path: './src/static_img/anantanew.png',
            cid: 'sponsor2'
          },
          {
            filename: 'iveonew.png',
            // path: '../static_img/iveo.png',
            path: './src/static_img/ievonew.png',
            cid: 'sponsor3'
          },
          {
            filename: 'wondernew.png',
            // path: '../static_img/wonder.png',
            path: './src/static_img/wondernew.png',
            cid: 'sponsor4'
          }
        ],
      });
    });

    // Wait for all email and QR code tasks to complete asynchronously
    await Promise.all(emailPromises);

    // res.status(200).json({ message: "Event booking successful." });
    res.status(200).json({
      message: "Event booking completed successfully.",
      eventBooking: savedEventBooking,
    });
  } catch (err) {
    // console.error(err);
    res.status(500).json({ error: err.message });
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
    res.status(200).json({ success: true, message: "User details found", data: user });
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



module.exports = { deleteEventType, createEventType, getEventType, updateEventType, getEventTypeByID, eventBooking, eventDetails, showUserData, updateEntry, registerCustomer, loginCustomer }