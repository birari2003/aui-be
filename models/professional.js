"use strict";

const { getProfessionalLevel } = require("../src/utils/level.util");

module.exports = (sequelize, DataTypes) => {
  const Professional = sequelize.define(
    "Professional",
    {
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
      experienceYears: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      level: {
        type: DataTypes.ENUM("fresher", "junior", "mid", "senior"),
        allowNull: false,
      },
      primarySkill: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      position: {
        type: DataTypes.ENUM("artist", "lead", "supervisor", "director", "other"),
        allowNull: false,
      },
      productionType: {
        type: DataTypes.ENUM("film", "tv", "web", "ads"),
        allowNull: false,
      },
      responsibilityScope: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      showreelUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      portfolioUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      availability: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      isMentor: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      mentorAvailability: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      mentorSpecializations: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      confidenceScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      verificationStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "professionals",
      hooks: {
        beforeValidate: (professional) => {
          professional.level = getProfessionalLevel(professional.experienceYears);
        },
      },
    }
  );

  Professional.associate = (models) => {
    Professional.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Professional.hasOne(models.TalentId, { foreignKey: "professionalId", as: "talentId" });
    Professional.hasMany(models.WorkLedger, { foreignKey: "professionalId", as: "workLedgers" });
    Professional.hasMany(models.Availability, { foreignKey: "professionalId", as: "availabilities" });
    Professional.hasMany(models.Engagement, { foreignKey: "professionalId", as: "engagements" });
    Professional.hasMany(models.Booking, { foreignKey: "professionalId", as: "bookings" });
    Professional.hasMany(models.TalentBench, { foreignKey: "professionalId", as: "savedByStudios" });
  };

  return Professional;
};
