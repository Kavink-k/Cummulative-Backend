// models/AttendanceRecord.js
module.exports = (sequelize, DataTypes) => {
  const AttendanceRecord = sequelize.define("AttendanceRecord", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    semester: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    workingDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    annualLeave: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sickLeave: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    gazettedHolidays: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    otherLeave: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    compensationDaysHours: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: "attendance_records",
    timestamps: true,
  });

  return AttendanceRecord;
};
