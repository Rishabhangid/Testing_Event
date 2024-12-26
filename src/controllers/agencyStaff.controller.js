const agencyStaffService = require("../service/agencyStaff.service");

// Create agency staff
const createAgencyStaff = async (req, res) => {
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
      role: "675abe50c43c6973f28d34c1", 
      profile_picture: req.files["profile_picture"][0].filename,
      aadhar_front: req.files["aadhar_front"][0].filename,
      aadhar_back: req.files["aadhar_back"][0].filename,
      pan_front: req.files["pan_front"][0].filename,
    };

    const isExist = await agencyStaffService.createAgencyStaff(data);
    return res.status(201).json({
      message: "Admin staff created successfully.",
      data: isExist,
    });
  } catch (error) {
    console.error(error,"------------------");
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all agency staff
const getAllAgencyStaff = async (req, res) => {
  try {
    const adminStaffList = await agencyStaffService.getAllAgencyStaff();
    return res.status(200).json(adminStaffList);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch admin staff." });
  }
};

// Get agency staff by ID
const getAgencyStaffById = async (req, res) => {
  console.log(req.params.id, "---------------req.params.id---------------");
  if(!req?.params?.id){
    return res.status(404).json({ message: "id is missing" });
  }
  try {
    const adminStaff = await agencyStaffService.getAgencyStaffById(req.params.id);
    if (!adminStaff) {
      return res.status(404).json({ message: "Admin staff not found." });
    }
    return res.status(200).json(adminStaff);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching admin staff." });
  }
};

// Update agency staff
const updateAgencyStaff = async (req, res) => {
  try {
    const updatedData = req.body;
    if (req.file) {
      updatedData.profile_picture = req.file.fieldname;
    }

    const updatedAdminStaff = await agencyStaffService.updateAgencyStaff(
      req.params.id,
      updatedData
    );

    if (!updatedAdminStaff) {
      return res.status(404).json({ message: "Admin staff not found." });
    }

    return res.status(200).json({
      message: "Admin staff updated successfully.",
      data: updatedAdminStaff,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update admin staff." });
  }
};

// Delete agency staff
const deleteAgencyStaff = async (req, res) => {
  try {
    const deletedAdminStaff = await agencyStaffService.deleteAdminStaff(req.params.id);

    if (!deletedAdminStaff) {
      return res.status(404).json({ message: "Admin staff not found." });
    }

    return res.status(200).json({
      message: "Admin staff deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting admin staff." });
  }
};

module.exports = {
    createAgencyStaff,
    getAllAgencyStaff,
    getAgencyStaffById,
    updateAgencyStaff,
    deleteAgencyStaff,
};
