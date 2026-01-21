// // models/ObservationalVisit.js
// module.exports = (sequelize, DataTypes) => {
//   const ObservationalVisit = sequelize.define("ObservationalVisit", {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },

//     studentId: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },

//     // Visits data stored as JSON array
//     visits: {
//       type: DataTypes.JSON,
//       allowNull: false,
//       comment: "Array of visits [{semester, institutionPlace, date}]",
//     },
//   }, {
//     tableName: "observational_visits",
//     timestamps: true,
//   });

//   return ObservationalVisit;
// };


// models/ObservationalVisit.js
module.exports = (sequelize, DataTypes) => {
  const ObservationalVisit = sequelize.define(
    "ObservationalVisit",
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
        comment: "Semester (I, II, III, IV, etc.)",
      },

      institutionPlace: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Institution visited",
      },

      date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: "Date of visit",
      },
    },
    {
      tableName: "observational_visits",
      timestamps: true,
    }
  );

  return ObservationalVisit;
};
