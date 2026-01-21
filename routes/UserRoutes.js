const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const adminAuth = require("../middleware/adminAuth");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, 'bulk-upload-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedTypes = /csv|xlsx|xls/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype) ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.mimetype === 'application/vnd.ms-excel';

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only CSV and Excel files are allowed'));
        }
    }
});

// Public routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// User routes (authenticated)
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.post("/:id/change-password", userController.changePassword);

// Admin-only routes (protected with adminAuth middleware)
router.get("/admin/stats", adminAuth, userController.getUserStats);
router.get("/admin/all", adminAuth, userController.getAllUsersForAdmin);
router.post("/admin/create", adminAuth, userController.createUserByAdmin);
router.put("/admin/:id", adminAuth, userController.updateUserByAdmin);
router.post("/admin/bulk-upload", adminAuth, upload.single('file'), userController.bulkUploadUsers);
router.get("/admin/template", adminAuth, userController.downloadTemplate);

module.exports = router;
