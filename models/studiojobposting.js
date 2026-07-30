"use strict";

module.exports = (sequelize, DataTypes) => {
  const StudioJobPosting = sequelize.define(
    "StudioJobPosting",
    {
      studioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      projectType: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      experienceRequired: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      artistCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("open", "paused", "closed"),
        allowNull: false,
        defaultValue: "open",
      },
      productionType: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      projectFormat: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      engagementType: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      workMode: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      locationPreference: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      timeZonePreference: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      requiredAvailability: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      opportunityOverview: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      softwareTools: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      requiredExperience: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      internalNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      verificationFields: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      filledCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      contractDuration: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      price: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      attachments: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: "studio_job_postings",
      underscored: true,
    }
  );

  StudioJobPosting.associate = (models) => {
    StudioJobPosting.belongsTo(models.Studio, { foreignKey: "studioId", as: "studio" });
  };

  return StudioJobPosting;
};
