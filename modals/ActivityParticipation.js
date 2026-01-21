// models/ActivityParticipation.js
module.exports = (sequelize, DataTypes) => {
  const ActivityParticipation = sequelize.define("ActivityParticipation", {
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
    sports: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coCurricular: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    extraCurricular: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sna: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nssYrcRrc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cne: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    awardsRewards: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: "activity_participation",
    timestamps: true,
  });

  return ActivityParticipation;
};
