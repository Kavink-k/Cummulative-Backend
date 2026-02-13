// models/PersonalProfile.js
module.exports = (sequelize, DataTypes) => {
  const PersonalProfile = sequelize.define(
    "PersonalProfile",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      // Link to student (for reference)
      studentId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      // Link to institution
      institutionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'institution_details',
          key: 'id'
        }
      },

      studentName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      dateOfBirth: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      nationality: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      religion: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      community: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      nativity: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      maritalStatus: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      parentGuardianName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      motherTongue: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      communicationAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      permanentAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      contactMobile: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      studentEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      aadharNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      ociNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      emisNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      mediumOfInstruction: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      photoUrl: {
        type: DataTypes.STRING, // file path or URL
        allowNull: true,
      },
      approvalStatus: {
        type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
        defaultValue: "PENDING",
        allowNull: false
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      approvedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      editedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      editRequestStatus: {
        type: DataTypes.ENUM("NONE", "REQUESTED", "ALLOWED"),
        defaultValue: "NONE",
        allowNull: false
      },
      editRequestReason: {
        type: DataTypes.TEXT,
        allowNull: true
      },
    },
    {
      tableName: "personal_profiles",
      timestamps: true,
    }
  );

  PersonalProfile.associate = (models) => {
    PersonalProfile.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
    PersonalProfile.belongsTo(models.User, { foreignKey: 'approvedBy', as: 'approver' });
    PersonalProfile.belongsTo(models.User, { foreignKey: 'editedBy', as: 'editor' });
    PersonalProfile.belongsTo(models.InstitutionDetail, { foreignKey: 'institutionId', as: 'institution' });
  };

  return PersonalProfile;
};
