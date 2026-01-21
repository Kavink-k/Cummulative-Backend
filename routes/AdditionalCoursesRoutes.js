const express = require("express");
const router = express.Router();
const {
    createAdditionalCourses,
    getAllCourses,
    getCourseById,
    getCourseByStudentId,
    deleteCourse
} = require("../controllers/AdditionalCoursesController");

// GET → Get all Additional Courses
router.get("/", getAllCourses);

// GET → Get Additional Courses by Student ID
router.get("/student/:studentId", getCourseByStudentId);

// GET → Get Additional Course by Primary Key ID
router.get("/:id", getCourseById);

// POST → Save Additional Courses form
router.post("/", createAdditionalCourses);

// DELETE → Delete Additional Course by ID
router.delete("/:id", deleteCourse);

module.exports = router;
