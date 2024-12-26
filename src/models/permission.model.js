const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  permission_name: {
    type: String,
    required: true,
  },
  module_name: {
    type: String, 
    required: true,
  },
  module: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: "Module",
  },
  route: {
    type: String,
    required: true, 
  },
  type: {
    type: String, 
    required: true, 
    enum: ["Create", "Update", "View", "Delete"],
  },
});

// Create the Mongoose model
const Permission = mongoose.model("Permission", permissionSchema);

module.exports.Permission = Permission;
