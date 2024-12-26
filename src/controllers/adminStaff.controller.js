const adminStaffService = require("../service/adminStaff.service");

// Create admin staff
const createAdminStaff = async (req, res) => {
  console.log(req, "---------------req.files---------------",req.body.firstname+req.body.lastname);
  try {
    const requiredFiles = ["profile_picture", "aadhar_front", "aadhar_back", "pan_front"];
    const missingFiles = requiredFiles.filter((file) => !req.files[file]);

    if (missingFiles.length > 0) {
      return res.status(400).json({
        message: "Validation Error: Missing required files.",
        missingFiles: missingFiles.map((file) => `${file} is required`),
      });
    }

    const data = {
      ...req.body,
      username:req.body.firstname+" "+req.body.lastname,
      role: "675abe36c43c6973f28d34bd", 
      profile_picture: req.files["profile_picture"][0].filename,
      aadhar_front: req.files["aadhar_front"][0].filename,
      aadhar_back: req.files["aadhar_back"][0].filename,
      pan_front: req.files["pan_front"][0].filename,
    };

    const isExist = await adminStaffService.createAdminStaff(data);
    return res.status(201).json({
      message: "Admin staff created successfully.",
      success:true,
      data: isExist,
    });
  } catch (error) {
    console.error(error,"------------------");
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all admin staff
const getAllAdminStaff = async (req, res) => {
  try {
    const adminStaffList = await adminStaffService.getAllAdminStaff();
    return res.status(200).json({data:adminStaffList, success:true,message: "Admin staff fetched successfully.",});
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch admin staff." });
  }
};

// Get admin staff by ID
const getAdminStaffById = async (req, res) => {
  console.log(req.params.id, "---------------req.params.id---------------");
  if(!req?.params?.id){
    return res.status(404).json({ message: "id is missing" });
  }
  try {
    const adminStaff = await adminStaffService.getAdminStaffById(req.params.id);
    if (!adminStaff) {
      return res.status(404).json({ message: "Admin staff not found." });
    }
    console.log(adminStaff, "---------------adminStaff---------------");
    return res.status(200).json({data:adminStaff, success:true,message: "Admin staff fetched successfully.",});
  } catch (error) {
    return res.status(500).json({ message: "Error fetching admin staff." });
  }
};

// Update admin staff
const updateAdminStaff = async (req, res) => {
  try {
    const updatedData = req.body;
    if (req.file) {
      updatedData.profile_picture = req.file.fieldname;
    }

    const updatedAdminStaff = await adminStaffService.updateAdminStaff(
      req.params.id,
      updatedData
    );

    if (!updatedAdminStaff) {
      return res.status(404).json({ message: "Admin staff not found." });
    }

    return res.status(200).json({
      message: "Admin staff updated successfully.",
      data: updatedAdminStaff,
      success:true
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update admin staff." });
  }
};

// Delete admin staff
const deleteAdminStaff = async (req, res) => {
  try {
    const deletedAdminStaff = await adminStaffService.deleteAdminStaff(req.params.id);

    if (!deletedAdminStaff) {
      return res.status(404).json({ message: "Admin staff not found." });
    }

    return res.status(200).json({
      message: "Admin staff deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting admin staff.",success:true });
  }
};

module.exports = {
  createAdminStaff,
  getAllAdminStaff,
  getAdminStaffById,
  updateAdminStaff,
  deleteAdminStaff,
};
