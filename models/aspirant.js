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
      },
      fullName: {
        type: DataTypes.STRING(150),
        allowNull: false,
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
      },
      educationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      educationTitle: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      year: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      interestedDepartment: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      verificationStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "aspirants",
      timestamps: true,
    }
  );

  Aspirant.associate = (models) => {
    Aspirant.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Aspirant.belongsTo(models.Education, { foreignKey: "educationId", as: "education" });
  };

  return Aspirant;
};
