// controllers/VerificationController.js
const { Verification } = require("../modals");

// @desc   Create or Update Verification (ONE row per student)
// @route  POST /api/verifications
exports.createVerification = async (req, res) => {
  try {
    const { studentId, verifications } = req.body;

    console.log("=== Verification Save Request ===");
    console.log("StudentId:", studentId);
    console.log("Verifications:", JSON.stringify(verifications, null, 2));

    if (!studentId || !verifications) {
      return res.status(400).json({
        message: "Required fields: studentId and verifications.",
      });
    }

    // Find existing record for this student
    const existing = await Verification.findOne({ where: { studentId } });

    console.log("Existing record found:", existing ? "YES" : "NO");

    if (existing) {
      // Update full JSON
      console.log("Updating existing record with ID:", existing.id);
      await existing.update({ verifications });
      return res.status(200).json({
        message: "Verification updated successfully.",
        data: existing,
      });
    }

    // Create new
    console.log("Creating new verification record");
    const newRecord = await Verification.create({
      studentId,
      verifications,
    });

    return res.status(201).json({
      message: "Verification saved successfully.",
      data: newRecord,
    });

  } catch (error) {
    console.error("Verification Save Error:", error);
    return res.status(500).json({
      message: "Internal server error saving verification.",
      error: error.message,
    });
  }
};

// @desc   Get all Verifications
// @route  GET /api/verifications
exports.getAllVerifications = async (req, res) => {
  try {
    const verifications = await Verification.findAll();
    return res.status(200).json({
      message: "Verifications retrieved successfully.",
      data: verifications,
    });
  } catch (error) {
    console.error("Verification Fetch All Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// @desc   Get Verification by ID
// @route  GET /api/verifications/:id
exports.getVerificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await Verification.findByPk(id);

    if (!record) {
      return res.status(404).json({ message: "Verification not found." });
    }

    return res.status(200).json({
      message: "Verification retrieved successfully.",
      data: record,
    });
  } catch (error) {
    console.error("Verification Fetch Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// @desc   Get Verifications by Student ID
// @route  GET /api/verifications/student/:studentId
exports.getVerificationByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    console.log("=== Fetching Verification for StudentId:", studentId, "===");

    const record = await Verification.findOne({ where: { studentId } });

    if (!record) {
      return res.status(404).json({ message: "No verification found for this student." });
    }

    return res.status(200).json({
      message: "Verification retrieved successfully.",
      data: record,
    });

  } catch (error) {
    console.error("Verification Fetch Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};