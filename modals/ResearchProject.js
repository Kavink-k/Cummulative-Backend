// models/ResearchProject.js
module.exports = (sequelize, DataTypes) => {
  const ResearchProject = sequelize.define("ResearchProject", {
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

    areaOfStudy: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Group or Individual",
    },

    projectTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: "research_projects",
    timestamps: true,
  });

  return ResearchProject;
};
