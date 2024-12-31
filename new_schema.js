const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        event_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Event' }, // mil jaygi
        bookingDetails_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'BookingDetails', },
        event_from_date: { type: Date, required: true, }, event_to_date: { type: Date, required: true, }, // mil jaygi
        ticket_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Ticket', }, // 
        ticket_price: { type: Number, required: true, }, // 
        no_of_members: { type: Number, required: true, }, // calculate krni pdegi
        booked_by: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', }, // staff ki id
        booked_at: { type: Date, default: Date.now, }, // 
        created_at: { type: Date, default: Date.now, },
        updated_at: { type: Date, default: Date.now, },
    },
    { timestamps: true }
);

const Booking = mongoose.model('Bookings', bookingSchema);

module.exports = Booking;


const bookingDetailsSchema = new mongoose.Schema(
    {
        customer_picture: { type: String, },
        customer_name: { type: String, required: true, },
        customer_phone: { type: String, required: true, },
        customer_email: { type: String, required: true, },
        customer_city: { type: String, },
        customer_organisation: { type: String, },
        customer_qr_picture: { type: String, },
        customer_qr_code: { type: String, },
        is_cancelled: { type: Boolean, default: false, },
        created_at: { type: Date, default: Date.now, },
        updated_at: { type: Date, default: Date.now, },
    },
    { timestamps: true }
);


const BookingDetails = mongoose.model('BookingDetails', bookingDetailsSchema);

module.exports = BookingDetails;










const eventBooking = async (req, res) => {
    try {
        // qrCodeDirectory
        console.log("hiiting")
        console.log("User who is booking, ID: ", req.user.sub)
        console.log("User who is booking, ID: ", req.params.eventid)
        const { users } = req.body;
        // console.log("Users from front", req.body);
        // console.log(req.files, "req.files");

        const files = req.files.map((file) => ({
            ...file,
            normalizedPath: file.path.replace(/\\/g, "/"),
        }));
        // user_booking

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
            // if (!pictureFile) {
            //   throw new Error("Picture file missing for user at index " + index);
            // }
            let uniqueCode = `${new Date().getTime()}${Math.floor(10 + Math.random() * 90)}`;

            return {
                pictures: pictureFile ? pictureFile.filename : "",
                names: user.names,
                mobile_numbers: user.mobile_numbers,
                emails: user.emails,
                organization_names: user.organization_names,
                cities: user.cities,
                created_at: new Date(),
                updated_at: new Date(),
                code: uniqueCode,
            };
        });

        // console.log("Users array:", usersArray);

        const savedEventBooking = new EventBookingNews({ users: usersArray });
        savedEventBooking.ticket_booker = req.user.sub;
        savedEventBooking.eventId = req.params.eventid;
        await savedEventBooking.save();



        const qrCodeDirectory = path.join(__dirname, '../uploads', 'qrCode');
        if (!fs.existsSync(qrCodeDirectory)) {
            fs.mkdirSync(qrCodeDirectory, { recursive: true });
        }

        const emailPromises = savedEventBooking.users.map(async (user, index) => {

            const uniqueCode = `${new Date().getTime()}${Math.floor(10 + Math.random() * 90)}`;

            console.log(uniqueCode)
            const userId = user._id;
            const qrCodeFilePath = path.join(qrCodeDirectory, `qrcode_${index}_${userId}.png`);
            const qrData = JSON.stringify({ user_id: userId, unique_code: uniqueCode });
            // await QRCode.toFile(qrCodeFilePath, `${userId}`, {
            await QRCode.toFile(qrCodeFilePath, qrData, {
                color: { dark: '#000000', light: '#fbf1e8' },
                width: 300,
            });

            const fileName = path.basename(qrCodeFilePath);
            user.qr_code = fileName;
            // user[index].code = uniqueCode;

            // savedEventBooking.markModified(`users.${index}`);

            await transporter.sendMail({
                from: '"Event Booking Confirmation" <your-email@gmail.com>',
                to: user.emails,
                subject: "Your Event QR Code",
                text: `Hello ${user.names},\n\nHere is your QR code for the event.`,
                html: `
        <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>India Industrial Fair</title>
       <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background-color: #f7f7f7;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #FBF1E8;
      border-radius: 10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      background-image: url('cid:bcakImg');
      background-position: center;
      background-size: cover;
    }
    .header, .footer {
      text-align: center;
      padding: 20px;

    }
    .header img {
      max-width: 80px;
      height: auto;
    }
    .title {
      font-size: 1.5rem;
      color: #000;
      margin: 10px 0;
      font-weight: bold;
    }
    .date-location {
      color: #E5552E;
      font-size: 1.25rem;
      font-weight: bold;
      margin: 10px 0;
    }
    .visitors-section {
      text-align: center;
      border: 2px solid #000;
      padding: 15px;
      margin: 15px;
      border-radius: 10px;
    }
    .visitors-section img {
      max-width: 150px;
      margin: 10px 0;
    }
    .username {
      font-size: 1.25rem;
      color: #000;
      font-weight: bold;
    }
    .footer img {
      max-width: 100px;
      margin: 10px;
    }
    @media (max-width: 768px) {
      .container {
        width: 90%;
      }
      .title {
        font-size: 1.25rem;
      }
      .date-location {
        font-size: 1rem;
      }
      .visitors-section {
        font-size: 1rem;
      }
    }
    @media (max-width: 480px) {
      .header img, .footer img {
        max-width: 50px;
      }
      .title {
        font-size: 1rem;
      }
      .date-location {
        font-size: 0.875rem;
      }
      .visitors-section {
        font-size: 0.875rem;
      }
    }
  </style>

    </head>
    <body>
        <div class="container" style="max-width: 600px; background-image: url('cid:bcakImg'); background-position: center; background-size: center; border-radius: 10px; margin: auto; padding: 20px; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2); font-family: Arial, sans-serif;">
  <div class="header" style="text-align: center;">
    <img src="cid:logo" style="width: 60px; height: auto; margin-bottom: 10px;" alt="Logo">
    <img src="cid:event" style="width: 220px; height: auto; margin-bottom: 10px;" alt="Event Logo">
    <img src="cid:india" style="width: 120px; height: auto; margin-bottom: 10px;" alt="Make in India">
    <div class="title" style="font-size: 22px; color: #000000; font-weight: 700; margin: 10px 0;">11TH <span style="color: #E5552E;">INDIA INDUSTRIAL FAIR 2025</span></div>
    <div class="date-location" style="color: #d9534f; font-size: 22px; font-weight: 900; margin: 15px 0;">10-13 JANUARY</div>
    <div class="date-location2" style="text-align: center; color: #d9534f; font-size: 22px; font-weight: 900; margin: 15px 0;">
      <table style="width: 100%; table-layout: fixed;">
        <tr>
          <td style="padding: 0;">
            <img src="cid:location" style="width: 30px; height: auto; vertical-align: middle;" alt="Location">
            <span style="vertical-align: middle;">DPS GROUND, BHUWANA, UDAIPUR</span>
          </td>
        </tr>
      </table>
    </div>
  </div>

  <div class="visitors-section" style="border: 3px solid #000; border-radius: 10px; background-color: #FBF1E8; padding: 15px; text-align: center; font-weight: bold; font-size: 20px; margin: 15px auto; max-width: 70%;">
    <div class="heading" style="font-size: 24px; font-weight: 900; color: #000;">VISITORS</div>
    <img src="cid:qrcode" style="margin-top: 10px;" alt="QR Code">
    <div class="username" style="font-size: 18px; font-weight: 900; color: #000; margin-top: 10px;">${user.names}</div>
  </div>

 <div class="footer" style="text-align: center; margin-top: 20px;">
  <div class="title" style="font-size: 22px; color: #000000; font-weight: 700;">OUR SPONSOR</div>
  <table align="center" style="width: 100%; margin-top: 20px; table-layout: fixed; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 5px; width: 25%;">
        <img src="cid:sponsor1" style="max-width: 100px; width: 80%; height: auto;" alt="Sponsor 1">
      </td>
      <td align="center" style="padding: 5px; width: 25%;">
        <img src="cid:sponsor2" style="max-width: 100px; width: 80%; height: auto;" alt="Sponsor 2">
      </td>
      <td align="center" style="padding: 5px; width: 25%;">
        <img src="cid:sponsor3" style="max-width: 100px; width: 80%; height: auto;" alt="Sponsor 3">
      </td>
      <td align="center" style="padding: 5px; width: 25%;">
        <img src="cid:sponsor4" style="max-width: 100px; width: 80%; height: auto;" alt="Sponsor 4">
      </td>
    </tr>
  </table>
</div>

</div>


    </body>
    </html>



           `, // HTML content here

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

        // Saving the booking id in the table
        console.log("Booking ID: ", savedEventBooking._id)
        const add_booking_id = await Bookings.create({ bookingId: savedEventBooking._id, user_booking: req.user.sub, eventId: req.params.eventid })
        if (!add_booking_id) {
            console.log("Bookinh id not saved")
        }
        console.log("Bookinh id saved.")
        // booker id,  eventid event name descrptn Agency agecnt

        // await savedEventBooking.save();
        // res.status(200).json({ message: "Event booking successful." });
        res.status(200).json({
            success: true,
            message: "Attended Created Succesfully.",
            eventBooking: savedEventBooking,
        });
    } catch (err) {
        // console.error(err);
        res.status(500).json({ error: err.message });
    }
};











