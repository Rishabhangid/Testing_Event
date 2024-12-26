const models = require("../models");

const authorization = async (req, res, next) => {
    try {
        // Step 1 - Check if role has permissions
        const user = await models.User.findById(req.user.sub);
        const role = await models.Role.findById(user.role._id)?.populate('permissions');
        if (!role.permissions || role.permissions.length === 0) {
            return res.send.status(401).json({
                success: false,
                message: `You do not have sufficient permissions to perform this action. Please contact your administrator for permissions.`
            });
        }

        // Step 2 - Continue with existing logic to authorize based on permissions
        const modules = (await models.Permission.find({
            route: {
                $in: (await models.Role.findById(
                    (await models.User.findById(req.user.sub)).role._id).populate('permissions')).permissions.map(permission => {
                        return permission.route
                    })
            }
        })).map(permissions => permissions.route);


        

        const segments = req.originalUrl.split('/');
        const secondLastSegment = segments[segments.length - 2];
        console.log("This is secondLastSegment --->", secondLastSegment);

        if (modules.indexOf(req.originalUrl.substring(req.originalUrl.lastIndexOf('/') + 1)) >= 0) {
            console.log((modules.indexOf(req.originalUrl.substring(req.originalUrl.lastIndexOf('/') + 1)), "I Authorized this route"))
            next();
        }
        else if (modules.indexOf(secondLastSegment) >= 0) {
            console.log(
              modules.indexOf(secondLastSegment),
              "else if --> I Authorized this route",
              secondLastSegment
            );
            next();
        }
        else {
            return res.status(401).json({
                success: false,
                message: `You are not authorized for this action!!!`,
            });
        }
        console.log(req.body, "---------------req.body-in authorization----END----------");

    } catch (error) {
        console.error('Authorization error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });

    }

}

module.exports = authorization;
