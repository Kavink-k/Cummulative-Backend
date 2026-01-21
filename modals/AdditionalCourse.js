// models/AdditionalCourse.js
module.exports = (sequelize, DataTypes) => {
  const AdditionalCourse = sequelize.define("AdditionalCourse", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    courseName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    from: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    to: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: "additional_courses",
    timestamps: true,
  });

  return AdditionalCourse;
};
