const express = require("express");
const router = express.Router();
const {
    createCourseCompletion,
    getAllCompletions,
    getCompletionById,
    getCompletionByStudentId
} = require("../controllers/CourseCompletionController");

// GET → Get all Course Completions
router.get("/", getAllCompletions);

// GET → Get Course Completions by Student ID
router.get("/student/:studentId", getCompletionByStudentId);

// GET → Get Course Completion by Primary Key ID
router.get("/:id", getCompletionById);

// POST → Save course completion form
router.post("/", createCourseCompletion);

module.exports = router;
