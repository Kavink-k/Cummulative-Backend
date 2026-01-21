const express = require("express");
const router = express.Router();
const {
    createEducationalQualification,
    getAllQualifications,
    getQualificationById,
    getQualificationByStudentId
} = require("../controllers/EducationalQualificationController");

// GET → Get all Educational Qualifications
router.get("/", getAllQualifications);

// GET → Get Educational Qualification by Student ID
router.get("/student/:studentId", getQualificationByStudentId);

// GET → Get Educational Qualification by Primary Key ID
router.get("/:id", getQualificationById);

// POST → Save Educational Qualification form
router.post("/", createEducationalQualification);

module.exports = router;
