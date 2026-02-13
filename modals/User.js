// models/User.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Name is required"
                    }
                }
            },

            designation: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Designation is required"
                    }
                }
            },

            institutionId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'institution_details',
                    key: 'id'
                },
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
                validate: {
                    notEmpty: {
                        msg: "Institution is required"
                    }
                }
            },

            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    msg: "Email already exists"
                },
                validate: {
                    isEmail: {
                        msg: "Must be a valid email address"
                    },
                    notEmpty: {
                        msg: "Email is required"
                    }
                }
            },

            phone: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Phone number is required"
                    },
                    is: {
                        args: /^[0-9]{10}$/,
                        msg: "Phone number must be 10 digits"
                    }
                }
            },

            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Password is required"
                    },
                    len: {
                        args: [6, 100],
                        msg: "Password must be at least 6 characters long"
                    }
                }
            },

            role: {
                type: DataTypes.ENUM("user", "admin", "principal"),
                defaultValue: "user",
                allowNull: false
            },

            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },

            lastLogin: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            tableName: "users",
            timestamps: true
        }
    );

    // Define association
    User.associate = (models) => {
        User.belongsTo(models.InstitutionDetail, {
            foreignKey: 'institutionId',
            as: 'institution'
        });
    };

    return User;
};
