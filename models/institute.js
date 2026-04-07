"use strict";

module.exports = (sequelize, DataTypes) => {
  const Institute = sequelize.define(
    "Institute",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      instituteName: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      website: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      contactPerson: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      designation: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      studentCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      branchCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      coursesOffered: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      conductsWorkshops: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      industryExposure: {
        type: DataTypes.ENUM("regularly", "occasionally", "never"),
        allowNull: true,
      },
      yearsInEducation: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      supportNeeded: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      activeServices: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      verificationUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      requirements: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      verificationStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "institutes",
    }
  );

  Institute.associate = (models) => {
    Institute.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Institute.hasMany(models.Booking, { foreignKey: "instituteId", as: "bookings" });
  };

  return Institute;
};
