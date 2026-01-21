// // controllers/ObservationalVisitController.js
// const { ObservationalVisit } = require("../modals");

// // @desc   Create new Observational Visit record
// // @route  POST /api/observational-visits
// exports.createObservationalVisit = async (req, res) => {
//   try {
//     const { studentId, visits } = req.body;

//     // --- Required field validation ---
//     if (!studentId || !visits) {
//       return res.status(400).json({
//         message: "Required fields: studentId and visits.",
//       });
//     }

//     // --- Create new record using Sequelize ---
//     const newVisit = await ObservationalVisit.create({
//       studentId,
//       visits,
//     });

//     // --- Success response ---
//     res.status(201).json({
//       message: "Observational visit record saved successfully.",
//       data: newVisit,
//     });
//   } catch (error) {
//     console.error("Error saving observational visit record:", error);
//     res.status(500).json({
//       message: "Server error while saving observational visit record.",
//     });
//   }
// };




// controllers/ObservationalVisitController.js

// controllers/ObservationalVisitController.js
const { ObservationalVisit } = require("../modals");

// @desc   Create or Update Observational Visit record
// @route  POST /api/observational-visits
exports.createObservationalVisit = async (req, res) => {
  try {
    const { studentId, semester, institutionPlace, date } = req.body;

    // --- Required field validation ---
    if (!studentId || !semester || !institutionPlace) {
      return res.status(400).json({
        message: "Required fields: studentId, semester, and institutionPlace.",
      });
    }

    // --- UPSERT LOGIC: Check if record exists ---
    // We check by Student + Semester + Institution Name
    const existingRecord = await ObservationalVisit.findOne({
      where: { studentId, semester, institutionPlace },
    });

    if (existingRecord) {
      // --- UPDATE Existing Record ---
      await existingRecord.update({
        date: date, // Update the date
      });

      return res.status(200).json({
        message: "Observational visit updated successfully.",
        data: existingRecord,
      });
    } else {
      // --- CREATE New Record ---
      const newVisit = await ObservationalVisit.create({
        studentId,
        semester,
        institutionPlace,
        date,
      });

      return res.status(201).json({
        message: "Observational visit saved successfully.",
        data: newVisit,
      });
    }
  } catch (error) {
    console.error("Error saving observational visit:", error);
    res.status(500).json({
      message: "Server error while saving observational visit.",
      error: error.message,
    });
  }
};

// @desc   Get all Observational Visits
// @route  GET /api/observational-visits
exports.getAllVisits = async (req, res) => {
  try {
    const visits = await ObservationalVisit.findAll();
    res.status(200).json({
      message: "Observational visits retrieved successfully.",
      data: visits,
    });
  } catch (error) {
    console.error("Error retrieving observational visits:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc   Get Observational Visit by Primary Key ID
// @route  GET /api/observational-visits/:id
exports.getVisitById = async (req, res) => {
  try {
    const { id } = req.params;
    const visit = await ObservationalVisit.findByPk(id);

    if (!visit) {
      return res.status(404).json({ message: "Observational visit not found." });
    }

    res.status(200).json({
      message: "Observational visit retrieved successfully.",
      data: visit,
    });
  } catch (error) {
    console.error("Error retrieving observational visit:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc   Get Observational Visits by Student ID
// @route  GET /api/observational-visits/student/:studentId
exports.getVisitByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const visits = await ObservationalVisit.findAll({ where: { studentId } });

    if (!visits || visits.length === 0) {
      return res.status(404).json({ message: "No observational visits found for this student ID." });
    }

    res.status(200).json({
      message: "Observational visits retrieved successfully.",
      data: visits,
    });
  } catch (error) {
    console.error("Error retrieving observational visits:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};