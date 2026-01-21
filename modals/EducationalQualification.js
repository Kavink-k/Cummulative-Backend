// models/EducationalQualification.js
module.exports = (sequelize, DataTypes) => {
  const EducationalQualification = sequelize.define("EducationalQualification", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    streamGroup: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Subject + Attempts Data (stored as JSON)
    subjects: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Array of subjects with plusOneAttempts and plusTwoAttempts [{subject, plusOneAttempts:[{maxMarks, score, percentage}], plusTwoAttempts:[{...}]}]",
    },

    // Totals for Plus One and Plus Two (stored as JSON arrays)
    totalPlusOneAttempts: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Array of total attempts for Plus One [{maxMarks, score, percentage}]",
    },
    totalPlusTwoAttempts: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Array of total attempts for Plus Two [{maxMarks, score, percentage}]",
    },

    // Certificate & Verification
    certificateNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    certificateDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    yearOfPassing: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    boardOfExamination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mediumOfInstruction: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hscVerificationNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hscVerificationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: "educational_qualifications",
    timestamps: true,
  });

  return EducationalQualification;
};
