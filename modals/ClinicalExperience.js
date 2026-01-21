// models/ClinicalExperience.js
module.exports = (sequelize, DataTypes) => {
  const ClinicalExperience = sequelize.define("ClinicalExperience", {
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
    clinicalArea: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    credits: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: true,
    },
    prescribedWeeks: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    prescribedHours: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    completedHours: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    hospital: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: "clinical_experiences",
    timestamps: true,
  });

  return ClinicalExperience;
};
