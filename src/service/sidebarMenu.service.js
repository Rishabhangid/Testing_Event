const { User, SidebarMenu } = require('../models');


const getUserSidebarMenus = async (userId) => {
  try {
    const user = await User.findById(userId).populate('role');
    const sidebarMenus = await SidebarMenu.find({ _id: { $in: user.role.sidebarMenus } });
    return sidebarMenus;
  } catch (error) {
    console.error('Error getting user sidebar menus:', error);
    throw error;
  }
};

const getSidebarMenus = async () => {
  try {
    const sidebarMenus = await SidebarMenu.find();
    return sidebarMenus;
  } catch (error) {
    console.error('Error getting user sidebar menus:', error);
    throw error;
  }
};

const formatSidebarMenus = (sidebarMenus) => {
  return sidebarMenus.map(menu => {
    const formattedMenu = {
      _id: menu._id,
      menu: menu.menu,
      parentMenu: menu.parentMenu,
      type: menu.type,
    };

    const subMenus = sidebarMenus.filter(subMenu => subMenu.parentMenu === menu.menu);
    if (subMenus.length > 0) {
      formattedMenu.subMenus = subMenus
        .filter(subMenu => subMenu.menu !== menu.menu)
        .map(subMenu => ({
          _id: subMenu._id,
          menu: subMenu.menu,
          parentMenu: subMenu.parentMenu,
          type: subMenu.type,
        }));
    }

    return sidebarMenus;
  });
};

const filterMainMenus = (formattedSidebarMenus) => {
  return formattedSidebarMenus.filter(menu =>
    !formattedSidebarMenus.some(subMenu => subMenu.subMenus && subMenu.subMenus.some(sub => sub.menu === menu.menu))
  );
};

module.exports = {
  getUserSidebarMenus,
  getSidebarMenus,
  formatSidebarMenus,
  filterMainMenus,
};
