// models/InstitutionDetail.js
module.exports = (sequelize, DataTypes) => {
    const InstitutionDetail = sequelize.define("InstitutionDetail", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        institutionName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        batch: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: "institution_details",
        timestamps: true,
    });

    // Define association
    InstitutionDetail.associate = (models) => {
        InstitutionDetail.hasMany(models.User, {
            foreignKey: 'institutionId',
            as: 'users'
        });
    };

    return InstitutionDetail;
};
