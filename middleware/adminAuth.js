// Middleware to verify admin role
const { User } = require("../modals");

const adminAuth = async (req, res, next) => {
    try {
        // In a real application, you would verify JWT token here
        // For now, we'll check if userId is passed in headers or session
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        // Find user and check role
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({
                message: "Access denied. Admin privileges required."
            });
        }

        // Attach user to request for use in controllers
        req.user = user;
        next();
    } catch (error) {
        console.error("Admin auth error:", error);
        res.status(500).json({
            message: "Authentication error",
            error: error.message
        });
    }
};

module.exports = adminAuth;
