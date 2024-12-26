const { permissionService } = require("../service");


const getPermission = async (req, res) => {
  
    try {
      const permissions = await permissionService.getPermission();
      res.json({ success: true, permissions: permissions });
    } catch (error) {
      console.error(error);
      if (error.name === 'ValidationError') {
        const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message);
        return res.status(400).json({
          success: false,
          message: validationErrors[0], 
        });
      }
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
const createPermission = async (req, res) => {

    try {
      const permissions = await permissionService.createPermission(req.body);
      console.log(permissions, "---------------permissions---------------");
      res.json({ success: true, permissions: permissions });

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
  };
  



module.exports = {
    getPermission,createPermission
};