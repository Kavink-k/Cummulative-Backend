// controllers/ClinicalExperienceController.js
const { ClinicalExperience } = require("../modals");

// @desc   Create new Clinical Experience record
// @route  POST /api/clinical-experiences
exports.createClinicalExperience = async (req, res) => {
  try {
    const {
      studentId,
      semester,
      clinicalArea,
      credits,
      prescribedWeeks,
      prescribedHours,
      completedHours,
      hospital,
    } = req.body;

    // --- Required field validation ---
    if (!studentId || !semester || !clinicalArea) {
      return res.status(400).json({
        message: "Required fields: studentId, semester, and clinicalArea.",
      });
    }

    // --- UPSERT LOGIC: Check if record exists ---
    const existingRecord = await ClinicalExperience.findOne({
      where: { studentId, semester, clinicalArea },
    });

    if (existingRecord) {
      // --- UPDATE Existing Record ---
      await existingRecord.update({
        credits,
        prescribedWeeks,
        prescribedHours,
        completedHours,
        hospital,
      });

      return res.status(200).json({
        message: "Clinical experience record updated successfully.",
        data: existingRecord,
      });
    } else {
      // --- CREATE New Record ---
      const newExperience = await ClinicalExperience.create({
        studentId,
        semester,
        clinicalArea,
        credits,
        prescribedWeeks,
        prescribedHours,
        completedHours,
        hospital,
      });

      return res.status(201).json({
        message: "Clinical experience record saved successfully.",
        data: newExperience,
      });
    }
  } catch (error) {
    console.error("Error saving clinical experience record:", error);
    res.status(500).json({
      message: "Server error while saving clinical experience record.",
    });
  }
};

// @desc   Get all Clinical Experiences
// @route  GET /api/clinical-experiences
exports.getAllClinicalExperiences = async (req, res) => {
  try {
    const experiences = await ClinicalExperience.findAll();
    res.status(200).json({
      message: "Clinical experiences retrieved successfully.",
      data: experiences,
    });
  } catch (error) {
    console.error("Error retrieving clinical experiences:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc   Get Clinical Experience by Primary Key ID
// @route  GET /api/clinical-experiences/:id
exports.getClinicalExperienceById = async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await ClinicalExperience.findByPk(id);

    if (!experience) {
      return res.status(404).json({ message: "Clinical experience not found." });
    }

    res.status(200).json({
      message: "Clinical experience retrieved successfully.",
      data: experience,
    });
  } catch (error) {
    console.error("Error retrieving clinical experience:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc   Get Clinical Experiences by Student ID
// @route  GET /api/clinical-experiences/student/:studentId
exports.getClinicalExperienceByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const experiences = await ClinicalExperience.findAll({ where: { studentId } });

    if (!experiences || experiences.length === 0) {
      return res.status(404).json({ message: "No clinical experiences found for this student ID." });
    }

    res.status(200).json({
      message: "Clinical experiences retrieved successfully.",
      data: experiences,
    });
  } catch (error) {
    console.error("Error retrieving clinical experiences:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
