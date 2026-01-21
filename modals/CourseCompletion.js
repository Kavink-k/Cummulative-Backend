// models/CourseCompletion.js
module.exports = (sequelize, DataTypes) => {
  const CourseCompletion = sequelize.define("CourseCompletion", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courseName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    certificateNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfIssue: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: "course_completions",
    timestamps: true,
  });

  return CourseCompletion;
};
