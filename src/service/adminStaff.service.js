const { User } = require("../models/user.model");

// Create a new admin staff
const createAdminStaff = async (data) => {
  console.log(data, "---------------data---------------");
  return await User.create(data);
};

// Get all admin staff
const getAllAdminStaff = async () => {
  return await User.find({ role: "675abe36c43c6973f28d34bd" }); // Filter by role
};

// Get admin staff by ID
const getAdminStaffById = async (id) => {
  return await User.findById(id);
  
};

// Update admin staff by ID
const updateAdminStaff = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete admin staff by ID
const deleteAdminStaff = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  createAdminStaff,
  getAllAdminStaff,
  getAdminStaffById,
  updateAdminStaff,
  deleteAdminStaff,
};
