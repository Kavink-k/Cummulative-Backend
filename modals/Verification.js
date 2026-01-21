// models/Verification.js
module.exports = (sequelize, DataTypes) => {
  const Verification = sequelize.define("Verification", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // CRITICAL: Ensures only ONE row per studentId
    },

    // Stores all 8 semesters' verification data as JSON
    verifications: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: "Array of verification objects [{ semester, classTeacherName, teacherSignature, principalSignature }]",
    },
  }, {
    tableName: "verifications",
    timestamps: true,
  });

  return Verification;
};
