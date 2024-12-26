const eventBooking = async (req, res) => {

    try {
      const { users } = req.body;
      console.log("Users from front", req.body)
  
      if (!users || users.length === 0) {
        return res.status(400).json({
          error: "Users array is empty.",
        });
      }
  
      // Map users to create the base data without qr_code
      const usersArray = users.map((user, index) => {
        if (!user.names || !user.mobile_numbers || !user.emails) {
          throw new Error("Missing required fields for user at index " + index);
        }
  
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
  
  
      const savedEventBooking = new EventBookingNews({
        users: usersArray,
      });
  
      await savedEventBooking.save(); // Save without qr_codes
  
      // Directory where QR codes will be stored
      const qrCodeDirectory = path.join(__dirname, "uploads", "qrCode");
  
      // Ensure the directory exists (you can use 'fs' to create it if it doesn't exist)
      
      if (!fs.existsSync(qrCodeDirectory)) {
        fs.mkdirSync(qrCodeDirectory, { recursive: true }); // Create the directory if it doesn't exist
      }
  
  
      // Now that the users have been saved, their ObjectIds are available
      const updatedUsersArray = await Promise.all(savedEventBooking.users.map(async (user, index) => {
        const userId = user._id; // MongoDB ObjectId for each user
  
        // Generate QR code with ObjectId
        const qrCodeFilePath = `qrcode_${index}_${userId}.png`; // Unique filename for each user
  
        // Generate QR code and save as image
        await QRCode.toFile(qrCodeFilePath, `${userId}`, {
        // await QRCode.toFile(qrCodeDirectory, `${userId}`, {
          color: {
            dark: '#000000',  // Dark color (QR code)
            light: '#ffffff'  // Light color (background)
          },
          width: 300  // Adjust the size of the QR code
        });
  
        // Now, update the user object with the QR code path
        user.qr_code = qrCodeFilePath;
        return user;
      }));
  
      // Update the savedEventBooking with the qr_code field populated for each user
      savedEventBooking.users = updatedUsersArray;
  
      // Save the updated event booking with qr_code paths
      const is_saved = await savedEventBooking.save();
      if (!is_saved) {
        console.log("not saved.")
      }
      console.log("saved.")
  
      // Respond with success message
      res.status(201).json({
        message: "Bookings added successfully with QR codes",
        data: savedEventBooking,
      });
    } catch (error) {
      console.error("Error adding booking:", error);
      res.status(400).json({ error: error.message || "Internal server error" });
    }
  }