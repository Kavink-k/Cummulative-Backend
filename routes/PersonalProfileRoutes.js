const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
    createPersonalProfile,
    updatePersonalProfile,
    getAllProfiles,
    getProfileById,
    getProfileByStudentId
} = require("../controllers/PersonalProfileController");

// GET → Get all Personal Profiles
router.get("/", getAllProfiles);

// GET → Get Personal Profile by Student ID
router.get("/student/:studentId", getProfileByStudentId);

// GET → Get Personal Profile by Primary Key ID
router.get("/:id", getProfileById);

// POST → Save Personal Profile form
router.post("/", upload.single("photo"), createPersonalProfile);

// PUT → Update Personal Profile form
router.put("/:id", upload.single("photo"), updatePersonalProfile);

module.exports = router;
