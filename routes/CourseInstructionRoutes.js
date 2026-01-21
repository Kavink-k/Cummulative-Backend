const express = require("express");
const router = express.Router();

const {
    createCourseInstruction,
    getAllCourseInstructions,
    getCourseInstructionById,
    getCourseInstructionByStudentId
} = require("../controllers/CourseInstructionController");

// GET → Get all Course Instructions
// router.get("/", getAllCourseInstructions);

// GET → Get Course Instructions by Student ID
router.get("/student/:studentId", getCourseInstructionByStudentId);

// GET → Get Course Instruction by Primary Key ID
// router.get("/:id", getCourseInstructionById);

router.post("/", createCourseInstruction);

module.exports = router;
