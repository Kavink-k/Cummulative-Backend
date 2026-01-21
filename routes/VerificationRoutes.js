const express = require("express");
const router = express.Router();
const {
    createVerification,
    getAllVerifications,
    getVerificationById,
    getVerificationByStudentId
} = require("../controllers/VerificationController");

// GET → Get all Verifications
router.get("/", getAllVerifications);

// GET → Get Verifications by Student ID
router.get("/student/:studentId", getVerificationByStudentId);

// GET → Get Verification by Primary Key ID
router.get("/:id", getVerificationById);

// POST → Save Verification form
router.post("/", createVerification);

module.exports = router;
