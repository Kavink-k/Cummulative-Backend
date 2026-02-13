const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const {
    createPersonalProfile,
    updatePersonalProfile,
    getAllProfiles,
    getProfileById,
    getProfileByStudentId,
    approveStudent,
    rejectStudent,
    requestEditAccess,
    allowEditAccess
} = require("../controllers/PersonalProfileController");

// Basic auth for all personal profile routes
router.use(auth);

// GET → Get all Personal Profiles
router.get("/", getAllProfiles);

// GET → Get Personal Profile by Student ID
router.get("/student/:studentId", getProfileByStudentId);

// PATCH → Approve/Reject Student profile
router.patch("/approve/:studentId", approveStudent);
router.patch("/reject/:studentId", rejectStudent);

// GET → Get Personal Profile by Primary Key ID
router.get("/:id", getProfileById);

// POST → Save Personal Profile form
router.post("/", upload.single("photo"), createPersonalProfile);

// PUT → Update Personal Profile form
router.put("/:id", upload.single("photo"), updatePersonalProfile);

// PATCH → Edit permissions
router.patch("/request-edit/:studentId", requestEditAccess);
router.patch("/allow-edit/:studentId", allowEditAccess);

module.exports = router;
