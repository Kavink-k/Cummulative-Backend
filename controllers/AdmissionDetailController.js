// controllers/AdmissionDetailController.js
const { AdmissionDetail } = require("../modals");

// @desc   Create or Update Admission Detail
// @route  POST /api/admission-details
exports.createAdmissionDetail = async (req, res) => {
  try {
    const {
      studentId,
      dateOfAdmission,
      admissionNumber,
      rollNumber,
      universityRegistration,
      migrationCertificateNo,
      migrationCertificateDate,
      eligibilityCertificateNo,
      eligibilityCertificateDate,
      allotmentCategory,
      allotmentNo,
      allotmentDate,
      communityCertificateNo,
      communityCertificateDate,
      nativityCertificateNo,
      nativityCertificateDate,
      dateOfDiscontinuation,
      reasonForDiscontinuation,
      scholarshipSource,
      scholarshipAmount,
      bankLoanSource,
      bankLoanAmount,
    } = req.body;

    // --- Required field validation ---
    if (!studentId) {
      return res.status(400).json({ message: "Required field: studentId" });
    }

    if (
      !dateOfAdmission ||
      !admissionNumber ||
      !rollNumber ||
      !allotmentCategory
    ) {
      return res.status(400).json({
        message:
          "Required fields: dateOfAdmission, admissionNumber, rollNumber, allotmentCategory.",
      });
    }

    // --- UPSERT LOGIC: Check if record exists ---
    const existingRecord = await AdmissionDetail.findOne({
      where: { studentId },
    });

    if (existingRecord) {
      // --- UPDATE Existing Record ---
      await existingRecord.update({
        dateOfAdmission,
        admissionNumber,
        rollNumber,
        universityRegistration,
        migrationCertificateNo,
        migrationCertificateDate,
        eligibilityCertificateNo,
        eligibilityCertificateDate,
        allotmentCategory,
        allotmentNo,
        allotmentDate,
        communityCertificateNo,
        communityCertificateDate,
        nativityCertificateNo,
        nativityCertificateDate,
        dateOfDiscontinuation,
        reasonForDiscontinuation,
        scholarshipSource,
        scholarshipAmount,
        bankLoanSource,
        bankLoanAmount,
      });

      return res.status(200).json({
        message: "Admission detail record updated successfully.",
        data: existingRecord,
      });
    } else {
      // --- CREATE New Record ---
      const newAdmission = await AdmissionDetail.create({
        studentId,
        dateOfAdmission,
        admissionNumber,
        rollNumber,
        universityRegistration,
        migrationCertificateNo,
        migrationCertificateDate,
        eligibilityCertificateNo,
        eligibilityCertificateDate,
        allotmentCategory,
        allotmentNo,
        allotmentDate,
        communityCertificateNo,
        communityCertificateDate,
        nativityCertificateNo,
        nativityCertificateDate,
        dateOfDiscontinuation,
        reasonForDiscontinuation,
        scholarshipSource,
        scholarshipAmount,
        bankLoanSource,
        bankLoanAmount,
      });

      return res.status(201).json({
        message: "Admission detail record saved successfully.",
        data: newAdmission,
      });
    }
  } catch (error) {
    console.error("Error saving admission detail record:", error);
    res.status(500).json({
      message: "Server error while saving admission detail record.",
    });
  }
};

// @desc   Get all Admission Details
// @route  GET /api/admission-details
exports.getAllAdmissions = async (req, res) => {
  try {
    const admissions = await AdmissionDetail.findAll();
    res.status(200).json({
      message: "Admission details retrieved successfully.",
      data: admissions,
    });
  } catch (error) {
    console.error("Error retrieving admission details:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc   Get Admission Detail by Primary Key ID
// @route  GET /api/admission-details/:id
exports.getAdmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const admission = await AdmissionDetail.findByPk(id);

    if (!admission) {
      return res.status(404).json({ message: "Admission detail not found." });
    }

    res.status(200).json({
      message: "Admission detail retrieved successfully.",
      data: admission,
    });
  } catch (error) {
    console.error("Error retrieving admission detail:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc   Get Admission Detail by Student ID
// @route  GET /api/admission-details/student/:studentId
exports.getAdmissionByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const admission = await AdmissionDetail.findOne({ where: { studentId } });

    if (!admission) {
      return res.status(404).json({ message: "Admission detail not found for this student ID." });
    }

    res.status(200).json({
      message: "Admission detail retrieved successfully.",
      data: admission,
    });
  } catch (error) {
    console.error("Error retrieving admission detail:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};