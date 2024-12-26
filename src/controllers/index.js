
module.exports.roleController = require('./role.controller.js');

//AdminStaff

module.exports.createAdminStaff = require("./adminStaff.controller").createAdminStaff;
module.exports.deleteAdminStaff = require("./adminStaff.controller").deleteAdminStaff;
module.exports.getAdminStaffById = require("./adminStaff.controller").getAdminStaffById;
module.exports.updateAdminStaff = require("./adminStaff.controller").updateAdminStaff;
module.exports.getAllAdminStaff = require("./adminStaff.controller").getAllAdminStaff;
module.exports.permissionController = require('./permission.controller.js');

//Agency
module.exports.createAgencyStaff = require("./agencyStaff.controller").createAgencyStaff;
module.exports.deleteAgencyStaff = require("./agencyStaff.controller").deleteAgencyStaff;
module.exports.getAgencyStaffById = require("./agencyStaff.controller").getAgencyStaffById;
module.exports.updatAgencyStaff = require("./agencyStaff.controller").updateAgencyStaff;
module.exports.getAllAgencyStaff = require("./agencyStaff.controller").getAllAgencyStaff;

//Events
module.exports.eventController = require('./events.controller');
module.exports.eventTypeController = require('./eventType.controller');