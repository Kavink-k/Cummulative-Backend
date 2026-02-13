const { User } = require("../modals");

const auth = async (req, res, next) => {
    try {
        const userId = req.headers['x-user-id'];

        if (!userId) {
            // Some routes might be public, but for those that need user info, 
            // the controller can check if req.user exists.
            return next();
        }

        const user = await User.findByPk(userId);
        if (user) {
            req.user = user;
        }
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        next();
    }
};

module.exports = auth;
