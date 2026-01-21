// // controllers/CourseInstructionController.js
// const { CourseInstruction } = require("../modals");

// // @desc   Create new Course Instruction record
// // @route  POST /api/course-instructions
// exports.createCourseInstruction = async (req, res) => {
//   try {
//     const {
//       studentId,
//       semester,
//       slNo,
//       courseCode,
//       universityCourseCode,
//       courseTitle,
//       theoryCredits,
//       skillLabCredits,
//       clinicalCredits,
//       theoryPrescribed,
//       theoryAttended,
//       theoryPercentage,
//       skillLabPrescribed,
//       skillLabAttended,
//       skillLabPercentage,
//       clinicalPrescribed,
//       clinicalAttended,
//       clinicalPercentage,
//       theoryInternalMax,
//       theoryInternalObtained,
//       theoryEndSemMax,
//       theoryEndSemObtained,
//       theoryTotalMax,
//       theoryTotalObtained,
//       practicalInternalMax,
//       practicalInternalObtained,
//       practicalEndSemMax,
//       practicalEndSemObtained,
//       practicalTotalMax,
//       practicalTotalObtained,
//       gradePoint,
//       letterGrade,
//     } = req.body;

//     // --- Required field validation ---
//     if (!studentId || !semester || !slNo || !courseTitle) {
//       return res.status(400).json({
//         message: "Required fields: studentId, semester, slNo, and courseTitle.",
//       });
//     }

//     // --- Create new record using Sequelize ORM ---
//     const newInstruction = await CourseInstruction.create({
//       studentId,
//       semester,
//       slNo,
//       courseCode,
//       universityCourseCode,
//       courseTitle,
//       theoryCredits,
//       skillLabCredits,
//       clinicalCredits,
//       theoryPrescribed,
//       theoryAttended,
//       theoryPercentage,
//       skillLabPrescribed,
//       skillLabAttended,
//       skillLabPercentage,
//       clinicalPrescribed,
//       clinicalAttended,
//       clinicalPercentage,
//       theoryInternalMax,
//       theoryInternalObtained,
//       theoryEndSemMax,
//       theoryEndSemObtained,
//       theoryTotalMax,
//       theoryTotalObtained,
//       practicalInternalMax,
//       practicalInternalObtained,
//       practicalEndSemMax,
//       practicalEndSemObtained,
//       practicalTotalMax,
//       practicalTotalObtained,
//       gradePoint,
//       letterGrade,
//     });

//     // --- Success response ---
//     res.status(201).json({
//       message: "Course instruction record saved successfully.",
//       data: newInstruction,
//     });
//   } catch (error) {
//     console.error("Error saving course instruction record:", error);
//     res.status(500).json({
//       message: "Server error while saving course instruction record.",
//     });
//   }
// };





// controllers/CourseInstructionController.js
const { CourseInstruction } = require("../modals");

// @desc   Create ALL course instructions for a semester (bulk)
// @route  POST /api/course-instructions
exports.createCourseInstruction = async (req, res) => {
  try {
    const { studentId, semester, courses } = req.body;

    if (!studentId || !semester) {
      return res.status(400).json({
        message: "studentId and semester are required.",
      });
    }

    if (!courses || !Array.isArray(courses)) {
      return res.status(400).json({
        message: "courses must be an array.",
      });
    }

    // Attach student & semester to each row
    const formattedRows = courses.map((course) => ({
      studentId,
      semester,
      ...course,
    }));

    // Upsert logic
    await CourseInstruction.bulkCreate(formattedRows, {
      updateOnDuplicate: [
        "universityCourseCode",
        "courseTitle",
        "theoryCredits",
        "skillLabCredits",
        "clinicalCredits",
        "theoryPrescribed",
        "theoryAttended",
        "theoryPercentage",
        "skillLabPrescribed",
        "skillLabAttended",
        "skillLabPercentage",
        "clinicalPrescribed",
        "clinicalAttended",
        "clinicalPercentage",
        "theoryInternalMax",
        "theoryInternalObtained",
        "theoryEndSemMax",
        "theoryEndSemObtained",
        "theoryTotalMax",
        "theoryTotalObtained",
        "practicalInternalMax",
        "practicalInternalObtained",
        "practicalEndSemMax",
        "practicalEndSemObtained",
        "practicalTotalMax",
        "practicalTotalObtained",
        "gradePoint",
        "letterGrade",
        "sgpa",
        "rank",
      ],
    });

    return res.status(201).json({
      message: "Course instructions saved successfully.",
    });
  } catch (error) {
    console.error("Error saving course instructions:", error);
    res.status(500).json({
      message: "Server error while saving course instructions.",
    });
  }
};

// ==================== GET ====================

// Get by studentId
exports.getCourseInstructionByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    const instructions = await CourseInstruction.findAll({
      where: { studentId },
      order: [["semester", "ASC"], ["sNo", "ASC"]],
    });

    res.status(200).json({
      message: "Course instructions retrieved successfully.",
      data: instructions,
    });
  } catch (error) {
    console.error("Error retrieving:", error);
    res.status(500).json({ message: "Server error" });
  }
};
