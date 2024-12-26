const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { roleService } = require("../service");

const getRoles = async (req, res) => {
  try {
    const roles = await roleService.getRole();
    res.json({ success: true, roles: roles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const createRole = catchAsync(async (req, res) => {
  try {
    
  
  const role = await roleService.createRole(req.body);
  res.status(200).send({
    role: role,
    message: "Role Created Successfully!",
  });
} catch (error) {
  if (error.name === 'ValidationError') {
    const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message);
    return res.status(400).json({
      success: false,
      message: validationErrors[0], // Send all validation errors
    });
  }
  res.status(500).json({ success: false, message: "Internal Server Error" });
}
})



const getRoleById = async (req, res) => {
  const { id } = req.params; 
  try {
    const roleById =
      await roleService.getRoleById(id);
    if (!roleById) {
      return res
        .status(404)
        .json({ success: false, message: "role By Id not found" });
    }
    res.json({ success: true, roleById });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteRole = catchAsync(async (req, res) => {
  const { id } = req.params;
  await roleService.deleteRole(id);
  res.json({ success: true, message: "Role deleted successfully" });
});

const updatRoleById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedData = req?.body;
  const updatedRole = await roleService.updatRoleById(
    id,
    updatedData
  );
  res.json({ success: true, role: updatedRole });
});



module.exports = {
  getRoles,
  createRole,
  getRoleById,
  updatRoleById,
  deleteRole,
};
