// models/AdmissionDetail.js
module.exports = (sequelize, DataTypes) => {
  const AdmissionDetail = sequelize.define("AdmissionDetail", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfAdmission: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    admissionNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rollNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    universityRegistration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    migrationCertificateNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    migrationCertificateDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    eligibilityCertificateNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    eligibilityCertificateDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    allotmentCategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    govtAllotmentNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    privateAllotmentNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    communityCertificateNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    communityCertificateDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nativityCertificateNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nativityCertificateDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateOfDiscontinuation: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reasonForDiscontinuation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    scholarshipSource: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    scholarshipAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    bankLoanSource: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bankLoanAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  }, {
    tableName: "admission_details",
    timestamps: true,
  });

  return AdmissionDetail;
};
