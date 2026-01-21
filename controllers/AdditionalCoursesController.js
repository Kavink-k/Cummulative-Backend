// controllers/AdditionalCoursesController.js
const { AdditionalCourses } = require("../modals");

// @desc   Create or Update Additional Courses record
// @route  POST /api/additional-courses
exports.createAdditionalCourses = async (req, res) => {
  try {
    const { id, studentId, courseId, courseName, from, to } = req.body;

    // --- Required field validation ---
    if (!studentId || !courseId || !courseName) {
      return res.status(400).json({
        message: "Required fields: studentId, courseId, and courseName.",
      });
    }

    // --- UPSERT LOGIC ---
    let existingRecord = null;

    // First, check if we have a database ID (for edits)
    if (id) {
      existingRecord = await AdditionalCourses.findByPk(id);
    }

    // If no ID or not found, check by studentId + courseId (unique constraint)
    if (!existingRecord) {
      existingRecord = await AdditionalCourses.findOne({
        where: { studentId, courseId },
      });
    }

    if (existingRecord) {
      // --- UPDATE Existing Record ---
      await existingRecord.update({
        courseName,
        from,
        to,
      });

      return res.status(200).json({
        message: "Additional course updated successfully.",
        data: existingRecord,
      });
    } else {
      // --- CREATE New Record ---
      const newCourse = await AdditionalCourses.create({
        studentId,
        courseId,
        courseName,
        from,
        to,
      });

      return res.status(201).json({
        message: "Additional course saved successfully.",
        data: newCourse,
      });
    }
  } catch (error) {
    console.error("Error saving additional courses record:", error);
    res.status(500).json({
      message: "Server error while saving additional courses record.",
    });
  }
};

// @desc   Get all Additional Courses
// @route  GET /api/additional-courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await AdditionalCourses.findAll();
    res.status(200).json({
      message: "Additional courses retrieved successfully.",
      data: courses,
    });
  } catch (error) {
    console.error("Error retrieving additional courses:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc   Get Additional Course by Primary Key ID
// @route  GET /api/additional-courses/:id
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await AdditionalCourses.findByPk(id);

    if (!course) {
      return res.status(404).json({ message: "Additional course not found." });
    }

    res.status(200).json({
      message: "Additional course retrieved successfully.",
      data: course,
    });
  } catch (error) {
    console.error("Error retrieving additional course:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc   Get Additional Courses by Student ID
// @route  GET /api/additional-courses/student/:studentId
exports.getCourseByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const courses = await AdditionalCourses.findAll({ where: { studentId } });

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No additional courses found for this student ID." });
    }

    res.status(200).json({
      message: "Additional courses retrieved successfully.",
      data: courses,
    });
  } catch (error) {
    console.error("Error retrieving additional courses:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc   Delete Additional Course by ID
// @route  DELETE /api/additional-courses/:id
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await AdditionalCourses.findByPk(id);

    if (!course) {
      return res.status(404).json({ message: "Additional course not found." });
    }

    const studentId = course.studentId;

    // Delete the course
    await course.destroy();

    // Get all remaining courses for this student
    const remainingCourses = await AdditionalCourses.findAll({
      where: { studentId },
      order: [['id', 'ASC']], // Order by database ID
    });

    // Reassign courseIds in ascending order (1, 2, 3, etc.)
    for (let i = 0; i < remainingCourses.length; i++) {
      await remainingCourses[i].update({
        courseId: String(i + 1),
      });
    }

    res.status(200).json({
      message: "Additional course deleted and courseIds reassigned successfully.",
      data: {
        deletedId: id,
        remainingCourses: remainingCourses.map(c => ({
          id: c.id,
          courseId: c.courseId,
          courseName: c.courseName,
          from: c.from,
          to: c.to,
        }))
      },
    });
  } catch (error) {
    console.error("Error deleting additional course:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
