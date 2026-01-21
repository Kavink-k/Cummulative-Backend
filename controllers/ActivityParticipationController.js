// // controllers/ActivityParticipationController.js
// const { ActivityParticipation } = require("../modals");

// // @desc   Create or Update Activity Participation record
// // @route  POST /api/activity-participation
// exports.createActivityParticipation = async (req, res) => {
//   try {
//     const {
//       studentId,
//       semester,
//       sports,
//       coCurricular,
//       extraCurricular,
//       sna,
//       nssYrcRrc,
//       cne,
//       awardsRewards,
//     } = req.body;

//     // --- Required field validation ---
//     if (!studentId || !semester) {
//       return res.status(400).json({ 
//         message: "Required fields: studentId and semester." 
//       });
//     }

//     // --- UPSERT LOGIC: Check if record exists ---
//     const existingRecord = await ActivityParticipation.findOne({
//       where: { studentId, semester },
//     });

//     if (existingRecord) {
//       // --- UPDATE Existing Record ---
//       await existingRecord.update({
//         sports,
//         coCurricular,
//         extraCurricular,
//         sna,
//         nssYrcRrc,
//         cne,
//         awardsRewards,
//       });

//       return res.status(200).json({
//         message: "Activity participation record updated successfully.",
//         data: existingRecord,
//       });
//     } else {
//       // --- CREATE New Record ---
//       const newParticipation = await ActivityParticipation.create({
//         studentId,
//         semester,
//         sports,
//         coCurricular,
//         extraCurricular,
//         sna,
//         nssYrcRrc,
//         cne,
//         awardsRewards,
//       });

//       return res.status(201).json({
//         message: "Activity participation record saved successfully.",
//         data: newParticipation,
//       });
//     }
//   } catch (error) {
//     console.error("Error saving activity participation record:", error);
//     res.status(500).json({
//       message: "Server error while saving activity participation record.",
//     });
//   }
// };

// controllers/ActivityParticipationController.js
const { ActivityParticipation } = require("../modals");

// @desc   Create or Update Activity Participation record
// @route  POST /api/activity-participation
exports.createActivityParticipation = async (req, res) => {
  try {
    const {
      studentId,
      semester,
      sports,
      coCurricular,
      extraCurricular,
      sna,
      nssYrcRrc,
      cne,
      awardsRewards,
    } = req.body;

    // --- Required field validation ---
    if (!studentId || !semester) {
      return res.status(400).json({
        message: "Required fields: studentId and semester."
      });
    }

    // --- UPSERT LOGIC: Check if record exists for this Student + Semester ---
    const existingRecord = await ActivityParticipation.findOne({
      where: { studentId, semester },
    });

    if (existingRecord) {
      // --- UPDATE Existing Record ---
      await existingRecord.update({
        sports,
        coCurricular,
        extraCurricular,
        sna,
        nssYrcRrc,
        cne,
        awardsRewards,
      });

      return res.status(200).json({
        message: "Activity participation record updated successfully.",
        data: existingRecord,
      });
    } else {
      // --- CREATE New Record ---
      const newParticipation = await ActivityParticipation.create({
        studentId,
        semester,
        sports,
        coCurricular,
        extraCurricular,
        sna,
        nssYrcRrc,
        cne,
        awardsRewards,
      });

      return res.status(201).json({
        message: "Activity participation record saved successfully.",
        data: newParticipation,
      });
    }
  } catch (error) {
    console.error("Error saving activity participation record:", error);
    res.status(500).json({
      message: "Server error while saving activity participation record.",
    });
  }
};

// @desc   Get all Activity Participation records
// @route  GET /api/activity-participation
exports.getAllActivities = async (req, res) => {
  try {
    const activities = await ActivityParticipation.findAll();
    res.status(200).json({
      message: "Activity participation records retrieved successfully.",
      data: activities,
    });
  } catch (error) {
    console.error("Error retrieving activity participation records:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc   Get Activity Participation by Primary Key ID
// @route  GET /api/activity-participation/:id
exports.getActivityById = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await ActivityParticipation.findByPk(id);

    if (!activity) {
      return res.status(404).json({ message: "Activity participation record not found." });
    }

    res.status(200).json({
      message: "Activity participation record retrieved successfully.",
      data: activity,
    });
  } catch (error) {
    console.error("Error retrieving activity participation record:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc   Get Activity Participation by Student ID (all semesters)
// @route  GET /api/activity-participation/student/:studentId
exports.getActivityByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const activities = await ActivityParticipation.findAll({ where: { studentId } });

    if (!activities || activities.length === 0) {
      return res.status(404).json({ message: "No activity participation records found for this student ID." });
    }

    res.status(200).json({
      message: "Activity participation records retrieved successfully.",
      data: activities,
    });
  } catch (error) {
    console.error("Error retrieving activity participation records:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};