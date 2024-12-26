const mongoose = require("mongoose");

const subMenuSchema = new mongoose.Schema({
  menu: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['mainMenu', 'subMenu'],
    required: true
  },
  priority: {
    type: Number,
    default: 0 // You can set a default priority value if needed
  },
  icon: String,
  route: String
});

const mainMenuSchema = new mongoose.Schema({
  menu: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['mainMenu', 'subMenu'],
    required: true
  },
  priority: {
    type: Number,
    default: 0 // You can set a default priority value if needed
  },
  parentMenu: String,
  icon: String,
  route: String,
  subMenu: [subMenuSchema]
}, {
  timestamps: true
});

const SidebarMenu = mongoose.model("SidebarMenu", mainMenuSchema);

module.exports.SidebarMenu = SidebarMenu;