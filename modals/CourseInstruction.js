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
        unique: true,
      },

      // JSON array containing all semester data
      // Structure: [{ semester, attempts: [{ attempt, courses: [...] }] }]
      semestersData: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
    },
    {
      tableName: "course_instructions",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['studentId'],
          name: 'unique_student_id'
        }
      ]
    }
  );

  return CourseInstruction;
};
