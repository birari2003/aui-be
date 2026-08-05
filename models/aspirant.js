"use strict";

module.exports = (sequelize, DataTypes) => {
  const Aspirant = sequelize.define(
    "Aspirant",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        field: 'userId'
      },
      fullName: {
        type: DataTypes.STRING(150),
        allowNull: false,
        field: 'fullName'
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      photoUrl: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        field: 'photoUrl'
      },
      dob: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      district: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      collegeName: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'collegeName'
      },
      educationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'educationId'
      },
      educationTitle: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'educationTitle'
      },
      year: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      interestedDepartment: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'interestedDepartment'
      },
      verificationStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'verificationStatus'
      },
    },
    {
      tableName: "aspirants",
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  );

  Aspirant.associate = (models) => {
    Aspirant.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Aspirant.belongsTo(models.Education, { foreignKey: "educationId", as: "education" });
  };

  return Aspirant;
};
