// models/CourseInstruction.js
module.exports = (sequelize, DataTypes) => {
  const CourseInstruction = sequelize.define(
    "CourseInstruction",
    {
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

      // 👉 FORM FIELDS (exactly matching frontend)

      sNo: DataTypes.STRING,
      courseCode: DataTypes.STRING,
      universityCourseCode: DataTypes.STRING,
      courseTitle: DataTypes.STRING,

      // Credits
      theoryCredits: DataTypes.STRING,
      skillLabCredits: DataTypes.STRING,
      clinicalCredits: DataTypes.STRING,

      // Instruction Hours - Theory
      theoryPrescribed: DataTypes.STRING,
      theoryAttended: DataTypes.STRING,
      theoryPercentage: DataTypes.STRING,

      // Skill Lab
      skillLabPrescribed: DataTypes.STRING,
      skillLabAttended: DataTypes.STRING,
      skillLabPercentage: DataTypes.STRING,

      // Clinical
      clinicalPrescribed: DataTypes.STRING,
      clinicalAttended: DataTypes.STRING,
      clinicalPercentage: DataTypes.STRING,

      // Marks - Theory
      theoryInternalMax: DataTypes.STRING,
      theoryInternalObtained: DataTypes.STRING,
      theoryEndSemMax: DataTypes.STRING,
      theoryEndSemObtained: DataTypes.STRING,
      theoryTotalMax: DataTypes.STRING,
      theoryTotalObtained: DataTypes.STRING,

      // Marks - Practical
      practicalInternalMax: DataTypes.STRING,
      practicalInternalObtained: DataTypes.STRING,
      practicalEndSemMax: DataTypes.STRING,
      practicalEndSemObtained: DataTypes.STRING,
      practicalTotalMax: DataTypes.STRING,
      practicalTotalObtained: DataTypes.STRING,

      // Grade Details
      gradePoint: DataTypes.STRING,
      letterGrade: DataTypes.STRING,
      sgpa: DataTypes.STRING,
      rank: DataTypes.STRING,
    },
    {
      tableName: "course_instructions",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['studentId', 'semester', 'sNo'],
          name: 'unique_course_per_student_semester'
        }
      ]
    }
  );

  return CourseInstruction;
};
