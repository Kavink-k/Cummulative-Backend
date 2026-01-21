const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save to uploads folder
  },
  filename: (req, file, cb) => {
    // Use studentId from request body as filename
    const studentId = req.body.studentId;
    const ext = path.extname(file.originalname);

    if (studentId) {
      // Save as: studentId.jpg (e.g., E25C1061.jpg)
      cb(null, `${studentId}${ext}`);
    } else {
      // Fallback to timestamp if studentId not provided
      cb(null, `${Date.now()}-${Math.floor(Math.random() * 1000000)}${ext}`);
    }
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
