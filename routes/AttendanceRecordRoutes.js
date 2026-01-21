const express = require("express");
const router = express.Router();
const {
    createAttendanceRecord,
    getAllAttendance,
    getAttendanceById,
    getAttendanceByStudentId
} = require("../controllers/AttendanceRecordController");

// GET → Get all Attendance Records
router.get("/", getAllAttendance);

// GET → Get Attendance Records by Student ID
router.get("/student/:studentId", getAttendanceByStudentId);

// GET → Get Attendance Record by Primary Key ID
router.get("/:id", getAttendanceById);

// POST → Save Attendance Record
router.post("/", createAttendanceRecord);

module.exports = router;
