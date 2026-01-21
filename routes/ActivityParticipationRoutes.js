const express = require("express");
const router = express.Router();
const {
    createActivityParticipation,
    getAllActivities,
    getActivityById,
    getActivityByStudentId
} = require("../controllers/ActivityParticipationController");

// GET → Get all Activity Participation records
router.get("/", getAllActivities);

// GET → Get Activity Participation by Student ID
router.get("/student/:studentId", getActivityByStudentId);

// GET → Get Activity Participation by Primary Key ID
router.get("/:id", getActivityById);

// POST → Save Activity Participation
router.post("/", createActivityParticipation);

module.exports = router;
