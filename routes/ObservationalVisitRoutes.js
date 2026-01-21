const express = require("express");
const router = express.Router();
const {
    createObservationalVisit,
    getAllVisits,
    getVisitById,
    getVisitByStudentId
} = require("../controllers/ObservationalVisitController");

// GET → Get all Observational Visits
router.get("/", getAllVisits);

// GET → Get Observational Visits by Student ID
router.get("/student/:studentId", getVisitByStudentId);

// GET → Get Observational Visit by Primary Key ID
router.get("/:id", getVisitById);

// POST → Save Observational Visit form
router.post("/", createObservationalVisit);

module.exports = router;
