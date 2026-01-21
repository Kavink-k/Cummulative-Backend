const express = require("express");
const router = express.Router();
const {
    createResearchProject,
    getAllProjects,
    getProjectById,
    getProjectByStudentId
} = require("../controllers/ResearchProjectController");

// GET → Get all Research Projects
router.get("/", getAllProjects);

// GET → Get Research Projects by Student ID
router.get("/student/:studentId", getProjectByStudentId);

// GET → Get Research Project by Primary Key ID
router.get("/:id", getProjectById);

// POST → Save Research Project form
router.post("/", createResearchProject);

module.exports = router;
