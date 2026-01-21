// controllers/CourseCompletionController.js
const { CourseCompletion } = require("../modals");

// @desc   Create new Course Completion record
// @route  POST /api/course-completions
exports.createCourseCompletion = async (req, res) => {
  try {
    const { studentId, courseName, certificateNumber, dateOfIssue } = req.body;

    // --- Required field validation ---
    if (!studentId || !courseName) {
      return res.status(400).json({
        message: "Required fields: studentId and courseName.",
      });
    }

    // --- Check if record exists ---
    let completion = await CourseCompletion.findOne({
      where: { studentId, courseName },
    });

    if (completion) {
      // --- Update existing record ---
      completion.certificateNumber = certificateNumber;
      completion.dateOfIssue = dateOfIssue;
      await completion.save();

      return res.status(200).json({
        message: "Course completion record updated successfully.",
        data: completion,
      });
    } else {
      // --- Create new record ---
      const newCompletion = await CourseCompletion.create({
        studentId,
        courseName,
        certificateNumber,
        dateOfIssue,
      });

      return res.status(201).json({
        message: "Course completion record saved successfully.",
        data: newCompletion,
      });
    }
  } catch (error) {
    console.error("Error saving course completion record:", error);
    res.status(500).json({
      message: "Server error while saving course completion record.",
    });
  }
};

// @desc   Get all Course Completions
// @route  GET /api/course-completions
exports.getAllCompletions = async (req, res) => {
  try {
    const completions = await CourseCompletion.findAll();
    res.status(200).json({
      message: "Course completions retrieved successfully.",
      data: completions,
    });
  } catch (error) {
    console.error("Error retrieving course completions:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc   Get Course Completion by Primary Key ID
// @route  GET /api/course-completions/:id
exports.getCompletionById = async (req, res) => {
  try {
    const { id } = req.params;
    const completion = await CourseCompletion.findByPk(id);

    if (!completion) {
      return res.status(404).json({ message: "Course completion not found." });
    }

    res.status(200).json({
      message: "Course completion retrieved successfully.",
      data: completion,
    });
  } catch (error) {
    console.error("Error retrieving course completion:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc   Get Course Completions by Student ID
// @route  GET /api/course-completions/student/:studentId
exports.getCompletionByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const completions = await CourseCompletion.findAll({ where: { studentId } });

    if (!completions || completions.length === 0) {
      return res.status(404).json({ message: "No course completions found for this student ID." });
    }

    res.status(200).json({
      message: "Course completions retrieved successfully.",
      data: completions,
    });
  } catch (error) {
    console.error("Error retrieving course completions:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
