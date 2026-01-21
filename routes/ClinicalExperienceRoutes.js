const express = require("express");
const router = express.Router();
const {
    createClinicalExperience,
    getAllClinicalExperiences,
    getClinicalExperienceById,
    getClinicalExperienceByStudentId
} = require("../controllers/ClinicalExperienceController");

// GET → Get all Clinical Experiences
router.get("/", getAllClinicalExperiences);

// GET → Get Clinical Experiences by Student ID
router.get("/student/:studentId", getClinicalExperienceByStudentId);

// GET → Get Clinical Experience by Primary Key ID
router.get("/:id", getClinicalExperienceById);

// POST → Save clinical experience form
router.post("/", createClinicalExperience);

module.exports = router;
