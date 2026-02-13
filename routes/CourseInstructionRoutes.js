const express = require("express");
const router = express.Router();

const {
    createCourseInstruction,
    getAllCourseInstructions,
    getCourseInstructionById,
    getCourseInstructionByStudentId,
    getAttemptsBySemester,
    getCourseInstructionBySemesterAttempt,
    updateSubjectSelection
} = require("../controllers/CourseInstructionController");

// GET → Get all Course Instructions
// router.get("/", getAllCourseInstructions);

// GET → Get Course Instructions by Student ID
router.get("/student/:studentId", getCourseInstructionByStudentId);

// GET → Get attempts for a specific semester
router.get("/student/:studentId/semester/:semester/attempts", getAttemptsBySemester);

// GET → Get Course Instructions by Student ID, Semester, and Attempt
router.get("/student/:studentId/semester/:semester/attempt/:attempt", getCourseInstructionBySemesterAttempt);

// PUT → Update subject selection for an attempt
router.put("/student/:studentId/semester/:semester/attempt/:attempt/selection", updateSubjectSelection);

// GET → Get Course Instruction by Primary Key ID
// router.get("/:id", getCourseInstructionById);

router.post("/", createCourseInstruction);

module.exports = router;
