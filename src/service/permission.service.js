const { Permission, User, Role } = require("../models");

const getPermission = async (roomCategoryData) => {
  try {
    const permission = Permission.find()
    return permission
  } catch (error) {
    console.error("Error adding room:", error);
    throw error;
  }
};
const createPermission = async (permissions) => {

  try {
    const permission =await Permission.create(permissions);
    await Role.findByIdAndUpdate(
    "675abe11c43c6973f28d34bb",
    { $addToSet: { permissions: permission._id } }, // Avoid duplicates in permissions array
    { new: true } 
  );

    return permission
  } catch (error) {
    console.error("Error adding room:", error);
    throw error;
  }
};


module.exports = {
    getPermission,createPermission
};
