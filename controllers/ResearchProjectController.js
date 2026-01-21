// controllers/ResearchProjectController.js
const { ResearchProject } = require("../modals");

// @desc   Create or Update Research Project record
// @route  POST /api/research-projects
exports.createResearchProject = async (req, res) => {
  try {
    const { studentId, semester, areaOfStudy, type, projectTitle } = req.body;

    // --- Required field validation ---
    if (!studentId || !semester || !areaOfStudy || !projectTitle) {
      return res.status(400).json({
        message: "Required fields: studentId, semester, areaOfStudy, and projectTitle.",
      });
    }

    // --- UPSERT LOGIC: Check if record exists ---
    const existingRecord = await ResearchProject.findOne({
      where: { studentId, semester },
    });

    if (existingRecord) {
      // --- UPDATE Existing Record ---
      await existingRecord.update({
        areaOfStudy,
        type,
      });

      return res.status(200).json({
        message: "Research project updated successfully.",
        data: existingRecord,
      });
    } else {
      // --- CREATE New Record ---
      const newProject = await ResearchProject.create({
        studentId,
        semester,
        areaOfStudy,
        type,
        projectTitle,
      });

      return res.status(201).json({
        message: "Research project saved successfully.",
        data: newProject,
      });
    }
  } catch (error) {
    console.error("Error saving research project record:", error);
    res.status(500).json({
      message: "Server error while saving research project record.",
    });
  }
};

// @desc   Get all Research Projects
// @route  GET /api/research-projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await ResearchProject.findAll();
    res.status(200).json({
      message: "Research projects retrieved successfully.",
      data: projects,
    });
  } catch (error) {
    console.error("Error retrieving research projects:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc   Get Research Project by Primary Key ID
// @route  GET /api/research-projects/:id
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await ResearchProject.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: "Research project not found." });
    }

    res.status(200).json({
      message: "Research project retrieved successfully.",
      data: project,
    });
  } catch (error) {
    console.error("Error retrieving research project:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc   Get Research Projects by Student ID
// @route  GET /api/research-projects/student/:studentId
exports.getProjectByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const projects = await ResearchProject.findAll({ where: { studentId } });

    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "No research projects found for this student ID." });
    }

    res.status(200).json({
      message: "Research projects retrieved successfully.",
      data: projects,
    });
  } catch (error) {
    console.error("Error retrieving research projects:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
