const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 50,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 255,
      required: true,
    },
    sidebarMenus: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "SideBarMenu",
      required: true
  }],
    deleted: { type: Boolean, default: false },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);

module.exports.Role = Role;
