"use strict";

module.exports = (sequelize, DataTypes) => {
  const Studio = sequelize.define(
    "Studio",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      studioName: {
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
      teamSize: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      yearsInOperation: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      workType: {
        type: DataTypes.ENUM("film", "series", "ads", "gaming"),
        allowNull: true,
      },
      hiringFrequency: {
        type: DataTypes.ENUM("frequent", "occasional", "rare"),
        allowNull: true,
      },
      projectType: {
        type: DataTypes.ENUM("international", "domestic", "both"),
        allowNull: true,
      },
      annualProjects: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      hiringTiers: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      linkedinProfile: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      verificationStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "studios",
    }
  );

  Studio.associate = (models) => {
    Studio.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Studio.hasMany(models.Engagement, { foreignKey: "studioId", as: "engagements" });
    Studio.hasMany(models.TalentBench, { foreignKey: "studioId", as: "talentBench" });
    Studio.hasMany(models.StudioRequestProfessional, { foreignKey: "studioId", as: "professionalRequests" });
    Studio.hasMany(models.StudioJobPosting, { foreignKey: "studioId", as: "jobPostings" });
    Studio.hasMany(models.HiringRequest, { foreignKey: "studioId", as: "hiringRequests" });
  };

  return Studio;
};
