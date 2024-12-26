const { User } = require('../models');
const { sidebarMenuService } = require('../service');

const getSidebarMenus = async (req, res) => {
  console.log(req.user.sub, "---------------req.user.sub---------------");
  try {
    const userId = req.user.sub;
    const sidebarMenus = await sidebarMenuService.getUserSidebarMenus(userId);
    // const formattedSidebarMenus = sidebarMenuService.formatSidebarMenus(sidebarMenus);
    // const filteredSidebarMenus = sidebarMenuService.filterMainMenus(formattedSidebarMenus);
    const sortedSidebarMenus = sidebarMenus.sort((a, b) => a.priority - b.priority);
    res.json({ success: true, sidebarMenus: sortedSidebarMenus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const getAllSidebarMenus = async (req, res) => {
 console.log(req, "---------------re---------------");
  try {
    const sidebarMenus = await sidebarMenuService.getSidebarMenus(req);
    res.json({ success: true, sidebarMenus: sidebarMenus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


module.exports = {
  getSidebarMenus,
  getAllSidebarMenus
};