const { Role } = require("../models");

const createRole = async (roleData) => {
  try {
    const role = await Role.create({ ...roleData });
    return { message: "Role created successfully", role };
  } catch (error) {
    console.error("Error adding role:", error);
    throw error;
  }
};

const getRole = async () => {
  try {
    const category = await Role.find();
    return category;
  } catch (error) {
    console.error("Error getting Category :", error);
    throw error;
  }
};

const getRoleById = async (Id) => {
  try {
    const roleById = await Role.findById(Id);
    if (!roleById) {
      throw new Error("Role not found");
    }
    return roleById;
  } catch (error) {
    console.error("Error getting Role by ID:", error);
    throw error;
  }
};

const updatRole = async (Id, updatedData) => {
  try {
    const existingRole = await Role.findById(Id);
    if (!existingRole) {
      throw new Error("Role not found");
    }
    const updatedRole = await Role.findByIdAndUpdate(
      Id,
      {
        $set: {
          sidebarMenus: updatedData.sidebarMenus,
          permissions: updatedData.permissions,
          role_name: updatedData.role_name,
        },
      },
      { new: true }
    );

    return updatedRole;
  } catch (error) {
    throw error;
  }
};


const deleteRole = async (Id) => {
  try {
    const updatedRole = await Role.findByIdAndUpdate(
      Id,
      { deleted: true },
      { new: true }
    );
    if (!updatedRole) {
      throw new Error("Role not found");
    }
    return updatedRole;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createRole,
  getRole,
  updatRole,
  getRoleById,
  deleteRole,
};
