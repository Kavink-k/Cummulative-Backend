// controllers/EducationalQualificationController.js
const { EducationalQualification } = require("../modals");

// @desc   Create or Update Educational Qualification record
// @route  POST /api/educational-qualifications
exports.createEducationalQualification = async (req, res) => {
  try {
    const {
      studentId,
      streamGroup,
      subjects,
      totalPlusOneAttempts,
      totalPlusTwoAttempts,
      certificateNo,
      certificateDate,
      yearOfPassing,
      boardOfExamination,
      mediumOfInstruction,
      hscVerificationNo,
      hscVerificationDate,
    } = req.body;

    // --- Required field validation ---
    if (
      !studentId ||
      !streamGroup ||
      !certificateNo ||
      !certificateDate ||
      !yearOfPassing ||
      !boardOfExamination ||
      !mediumOfInstruction ||
      !hscVerificationNo ||
      !hscVerificationDate
    ) {
      return res.status(400).json({
        message:
          "Required fields: studentId, streamGroup, certificateNo, certificateDate, yearOfPassing, boardOfExamination, mediumOfInstruction, hscVerificationNo, hscVerificationDate.",
      });
    }

    // --- UPSERT LOGIC: Check if record exists ---
    const existingRecord = await EducationalQualification.findOne({
      where: { studentId }
    });

    if (existingRecord) {
      // --- Update Existing Record ---
      await existingRecord.update({
        streamGroup,
        subjects,
        totalPlusOneAttempts,
        totalPlusTwoAttempts,
        certificateNo,
        certificateDate,
        yearOfPassing,
        boardOfExamination,
        mediumOfInstruction,
        hscVerificationNo,
        hscVerificationDate,
      });

      return res.status(200).json({
        message: "Educational qualification record updated successfully.",
        data: existingRecord,
      });
    } else {
      // --- Create New Record ---
      const newQualification = await EducationalQualification.create({
        studentId,
        streamGroup,
        subjects,
        totalPlusOneAttempts,
        totalPlusTwoAttempts,
        certificateNo,
        certificateDate,
        yearOfPassing,
        boardOfExamination,
        mediumOfInstruction,
        hscVerificationNo,
        hscVerificationDate,
      });

      return res.status(201).json({
        message: "Educational qualification record saved successfully.",
        data: newQualification,
      });
    }

  } catch (error) {
    console.error("Error saving educational qualification record:", error);
    res.status(500).json({
      message: "Server error while saving educational qualification record.",
    });
  }
};

// @desc   Get all Educational Qualifications
// @route  GET /api/educational-qualifications
exports.getAllQualifications = async (req, res) => {
  try {
    const qualifications = await EducationalQualification.findAll();
    res.status(200).json({
      message: "Educational qualifications retrieved successfully.",
      data: qualifications,
    });
  } catch (error) {
    console.error("Error retrieving educational qualifications:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc   Get Educational Qualification by Primary Key ID
// @route  GET /api/educational-qualifications/:id
exports.getQualificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const qualification = await EducationalQualification.findByPk(id);

    if (!qualification) {
      return res.status(404).json({ message: "Educational qualification not found." });
    }

    res.status(200).json({
      message: "Educational qualification retrieved successfully.",
      data: qualification,
    });
  } catch (error) {
    console.error("Error retrieving educational qualification:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc   Get Educational Qualification by Student ID
// @route  GET /api/educational-qualifications/student/:studentId
exports.getQualificationByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const qualification = await EducationalQualification.findOne({ where: { studentId } });

    if (!qualification) {
      return res.status(404).json({ message: "Educational qualification not found for this student ID." });
    }

    res.status(200).json({
      message: "Educational qualification retrieved successfully.",
      data: qualification,
    });
  } catch (error) {
    console.error("Error retrieving educational qualification:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};