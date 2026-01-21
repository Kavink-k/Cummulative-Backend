// controllers/AttendanceRecordController.js
const { AttendanceRecord } = require("../modals");

// @desc   Create or Update Attendance Record
// @route  POST /api/attendance-records
exports.createAttendanceRecord = async (req, res) => {
  try {
    const {
      studentId,
      semester,
      workingDays,
      annualLeave,
      sickLeave,
      gazettedHolidays,
      otherLeave,
      compensationDaysHours,
    } = req.body;

    // --- Required field validation ---
    if (!studentId || !semester) {
      return res.status(400).json({
        message: "Required fields: studentId and semester.",
      });
    }

    // --- CHECK: Does a record already exist for this Student + Semester? ---
    const existingRecord = await AttendanceRecord.findOne({
      where: { studentId, semester },
    });

    if (existingRecord) {
      // --- UPDATE Existing Record ---
      await existingRecord.update({
        workingDays,
        annualLeave,
        sickLeave,
        gazettedHolidays,
        otherLeave,
        compensationDaysHours,
      });

      return res.status(200).json({
        message: "Attendance record updated successfully.",
        data: existingRecord,
      });
    } else {
      // --- CREATE New Record ---
      const newRecord = await AttendanceRecord.create({
        studentId,
        semester,
        workingDays,
        annualLeave,
        sickLeave,
        gazettedHolidays,
        otherLeave,
        compensationDaysHours,
      });

      return res.status(201).json({
        message: "Attendance record saved successfully.",
        data: newRecord,
      });
    }
  } catch (error) {
    console.error("Error saving attendance record:", error);
    res.status(500).json({
      message: "Server error while saving attendance record.",
    });
  }
};

// @desc   Get all Attendance Records
// @route  GET /api/attendance-records
exports.getAllAttendance = async (req, res) => {
  try {
    const records = await AttendanceRecord.findAll();
    res.status(200).json({
      message: "Attendance records retrieved successfully.",
      data: records,
    });
  } catch (error) {
    console.error("Error retrieving attendance records:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc   Get Attendance Record by Primary Key ID
// @route  GET /api/attendance-records/:id
exports.getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await AttendanceRecord.findByPk(id);

    if (!record) {
      return res.status(404).json({ message: "Attendance record not found." });
    }

    res.status(200).json({
      message: "Attendance record retrieved successfully.",
      data: record,
    });
  } catch (error) {
    console.error("Error retrieving attendance record:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc   Get Attendance Records by Student ID (all semesters)
// @route  GET /api/attendance-records/student/:studentId
exports.getAttendanceByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    const records = await AttendanceRecord.findAll({
      where: { studentId },
      order: [
        [
          AttendanceRecord.sequelize.literal(`
            FIELD(semester,'I','II','III','IV','V','VI','VII','VIII')
          `),
          "ASC",
        ],
      ],
    });

    if (!records || records.length === 0) {
      return res.status(404).json({
        message: "No attendance records found for this student ID.",
      });
    }

    res.status(200).json({
      message: "Attendance records retrieved successfully.",
      data: records,
    });
  } catch (error) {
    console.error("Error retrieving attendance records:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
