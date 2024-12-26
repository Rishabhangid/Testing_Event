const { User } = require("../models/user.model");

// Create a new admin staff
const createAgencyStaff = async (data) => {
  console.log(data, "---------------data---------------");
  return await User.create(data);
};

// Get all admin staff
const getAllAgencyStaff = async () => {
  return await User.find({ role: "675abe36c43c6973f28d34bd" }); // Filter by role
};

// Get admin staff by ID
const getAgencyStaffById = async (id) => {
  return await User.findById(id);
};

// Update admin staff by ID
const updateAgencyStaff = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete admin staff by ID
const deleteAgencyStaff = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  createAgencyStaff,
  getAllAgencyStaff,
  getAgencyStaffById,
  updateAgencyStaff,
  deleteAgencyStaff,
};
