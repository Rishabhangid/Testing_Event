const { User } = require("../models/user.model");

// Create a new admin staff
const createAgency = async (data) => {
  console.log(data, "---------------data---------------");
  return await User.create(data);
};

// Get all admin staff
const getAllAgency = async () => {
  return await User.find({ role: "675abe45c43c6973f28d34bf" }); // Filter by role
};

// Get admin staff by ID
const getAgencyById = async (id) => {
  return await User.findById(id);
};

// Update admin staff by ID
const updateAgency = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete admin staff by ID
const deleteAgency = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  createAgency,
  getAllAgency,
  getAgencyById,
  updateAgency,
  deleteAgency,
};
