// controllers/CourseInstructionController.js
const { CourseInstruction } = require("../modals");

// @desc   Create/Update course instructions for a semester (bulk)
// @route  POST /api/course-instructions
exports.createCourseInstruction = async (req, res) => {
  try {
    console.log("📥 Backend received:", JSON.stringify(req.body, null, 2));
    
    const { studentId, semester, courses, attempt = 0 } = req.body;
    
    // Log incoming data with types
    console.log("📋 Incoming attempt:", attempt, "| Type:", typeof attempt);

    if (!studentId || !semester) {
      console.log("❌ Validation failed: Missing studentId or semester");
      return res.status(400).json({
        message: "studentId and semester are required.",
      });
    }

    if (!courses || !Array.isArray(courses)) {
      console.log("❌ Validation failed: courses is not an array or missing");
      return res.status(400).json({
        message: "courses must be an array.",
      });
    }
    
    console.log("✅ Validation passed. Creating/updating course instruction...");

    // Find or create student record
    let studentRecord = await CourseInstruction.findOne({
      where: { studentId },
    });

    let semestersData = [];

    if (studentRecord) {
      // Get existing semesters data
      semestersData = studentRecord.semestersData || [];
      console.log("📂 Found existing student record. Total semesters:", semestersData.length);
    } else {
      console.log("🆕 No existing record found. Creating new student record.");
    }

    // Find or create semester in the array
    let semesterIndex = semestersData.findIndex((s) => s.semester === semester);

    if (semesterIndex === -1) {
      // Create new semester entry
      console.log("🆕 Creating new semester entry for:", semester);
      semestersData.push({
        semester,
        attempts: [],
      });
      semesterIndex = semestersData.length - 1;
    } else {
      console.log("📂 Found existing semester:", semester, "| Existing attempts:", 
        semestersData[semesterIndex].attempts.map(a => `${a.attempt} (${typeof a.attempt})`).join(", "));
    }

    // Find or create attempt in the semester
    // CRITICAL FIX: Convert both to numbers for comparison to avoid type mismatch
    const attemptNumber = Number(attempt);
    let attemptIndex = semestersData[semesterIndex].attempts.findIndex(
      (a) => Number(a.attempt) === attemptNumber
    );

    if (attemptIndex === -1) {
      // Create new attempt entry
      console.log("🆕 Creating new attempt:", attemptNumber, "for semester:", semester);
      semestersData[semesterIndex].attempts.push({
        attempt: attemptNumber,
        courses: [],
      });
      attemptIndex = semestersData[semesterIndex].attempts.length - 1;
    } else {
      console.log("🔄 Updating existing attempt:", attemptNumber, "for semester:", semester);
    }

    // Update courses for this attempt
    semestersData[semesterIndex].attempts[attemptIndex].courses = courses;

    console.log("📝 About to save/update. Semester:", semester, "Attempt:", attemptNumber, "Courses count:", courses.length);

    // Save or update the record
    if (studentRecord) {
      // IMPORTANT: Mark the field as changed for Sequelize to detect JSON updates
      studentRecord.set('semestersData', semestersData);
      studentRecord.changed('semestersData', true);
      
      const result = await studentRecord.save({ fields: ['semestersData'] });
      
      console.log("✅ Updated existing record for studentId:", studentId);
      console.log("📊 Updated semestersData length:", result.semestersData?.length);
    } else {
      await CourseInstruction.create({
        studentId,
        semestersData,
      });
      console.log("✅ Created new record for studentId:", studentId);
    }

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

    const studentRecord = await CourseInstruction.findOne({
      where: { studentId },
    });

    if (!studentRecord) {
      return res.status(200).json({
        message: "No course instructions found for this student.",
        data: [],
      });
    }

    // Return the semestersData array
    res.status(200).json({
      message: "Course instructions retrieved successfully.",
      data: studentRecord.semestersData || [],
    });
  } catch (error) {
    console.error("Error retrieving:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get attempts for a specific semester
exports.getAttemptsBySemester = async (req, res) => {
  try {
    const { studentId, semester } = req.params;

    const studentRecord = await CourseInstruction.findOne({
      where: { studentId },
    });

    if (!studentRecord) {
      return res.status(200).json({
        message: "No attempts found.",
        data: [],
      });
    }

    const semestersData = studentRecord.semestersData || [];
    const semesterData = semestersData.find((s) => s.semester === semester);

    if (!semesterData) {
      return res.status(200).json({
        message: "No attempts found for this semester.",
        data: [],
      });
    }

    const attemptNumbers = semesterData.attempts.map((a) => a.attempt);

    res.status(200).json({
      message: "Attempts retrieved successfully.",
      data: attemptNumbers,
    });
  } catch (error) {
    console.error("Error retrieving attempts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get course instructions for specific semester and attempt
exports.getCourseInstructionBySemesterAttempt = async (req, res) => {
  try {
    const { studentId, semester, attempt } = req.params;

    const studentRecord = await CourseInstruction.findOne({
      where: { studentId },
    });

    if (!studentRecord) {
      return res.status(200).json({
        message: "No course instructions found.",
        data: [],
      });
    }

    const semestersData = studentRecord.semestersData || [];
    const semesterData = semestersData.find((s) => s.semester === semester);

    if (!semesterData) {
      return res.status(200).json({
        message: "No data found for this semester.",
        data: [],
      });
    }

    const attemptData = semesterData.attempts.find(
      (a) => a.attempt === parseInt(attempt)
    );

    if (!attemptData) {
      return res.status(200).json({
        message: "No data found for this attempt.",
        data: [],
      });
    }

    res.status(200).json({
      message: "Course instructions retrieved successfully.",
      data: attemptData.courses || [],
    });
  } catch (error) {
    console.error("Error retrieving:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update subject selection for an attempt
exports.updateSubjectSelection = async (req, res) => {
  try {
    const { studentId, semester, attempt } = req.params;
    const { selectedCourses } = req.body;

    if (!selectedCourses || !Array.isArray(selectedCourses)) {
      return res.status(400).json({
        message: "selectedCourses must be an array of sNo values.",
      });
    }

    const studentRecord = await CourseInstruction.findOne({
      where: { studentId },
    });

    if (!studentRecord) {
      return res.status(404).json({
        message: "Student record not found.",
      });
    }

    const semestersData = studentRecord.semestersData || [];
    const semesterIndex = semestersData.findIndex((s) => s.semester === semester);

    if (semesterIndex === -1) {
      return res.status(404).json({
        message: "Semester not found.",
      });
    }

    const attemptIndex = semestersData[semesterIndex].attempts.findIndex(
      (a) => a.attempt === parseInt(attempt)
    );

    if (attemptIndex === -1) {
      return res.status(404).json({
        message: "Attempt not found.",
      });
    }

    // Update isSelected for all courses
    const courses = semestersData[semesterIndex].attempts[attemptIndex].courses;
    courses.forEach((course) => {
      course.isSelected = selectedCourses.includes(course.sNo);
    });

    // Save updated data
    await studentRecord.update({ semestersData });

    res.status(200).json({
      message: "Subject selection updated successfully.",
    });
  } catch (error) {
    console.error("Error updating selection:", error);
    res.status(500).json({ message: "Server error" });
  }
};

