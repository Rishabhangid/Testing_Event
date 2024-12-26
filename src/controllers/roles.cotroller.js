const { Role } = require("./models/role");

// Create a new role
const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    const role = new Role({
      name,
      description,
    });

    await role.save();
    return res.status(201).json({ message: "Role created successfully.", role });
  } catch (error) {
    return res.status(400).json({ message: "Error creating role.", error });
  }
};

// Get all roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    return res.status(200).json(roles);
  } catch (error) {
    return res.status(400).json({ message: "Error fetching roles.", error });
  }
};

// Get a single role by ID
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id);
    if (!role) return res.status(404).json({ message: "Role not found." });

    return res.status(200).json(role);
  } catch (error) {
    return res.status(400).json({ message: "Error fetching role.", error });
  }
};

// Update a role by ID
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const role = await Role.findByIdAndUpdate(id, updates, { new: true });
    if (!role) return res.status(404).json({ message: "Role not found." });

    return res.status(200).json({ message: "Role updated successfully.", role });
  } catch (error) {
    return res.status(400).json({ message: "Error updating role.", error });
  }
};

// Delete a role by ID
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByIdAndDelete(id);
    if (!role) return res.status(404).json({ message: "Role not found." });

    return res.status(200).json({ message: "Role deleted successfully." });
  } catch (error) {
    return res.status(400).json({ message: "Error deleting role.", error });
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
