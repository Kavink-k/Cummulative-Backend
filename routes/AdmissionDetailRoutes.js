const express = require("express");
const router = express.Router();
const {
    createAdmissionDetail,
    getAllAdmissions,
    getAdmissionById,
    getAdmissionByStudentId
} = require("../controllers/AdmissionDetailController");

// GET → Get all Admission Details
router.get("/", getAllAdmissions);

// GET → Get Admission Detail by Student ID
router.get("/student/:studentId", getAdmissionByStudentId);

// GET → Get Admission Detail by Primary Key ID
router.get("/:id", getAdmissionById);

// POST → Save Admission Detail form
router.post("/", createAdmissionDetail);

module.exports = router;
