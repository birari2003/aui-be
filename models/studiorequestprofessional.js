"use strict";

module.exports = (sequelize, DataTypes) => {
  const StudioRequestProfessional = sequelize.define(
    "StudioRequestProfessional",
    {
      studioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      professionalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
          },
      roleTitle: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      productionType: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      projectFormat: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      opportunityOverview: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      roleRequirements: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      startAvailability: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      workMode: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      includeCompensation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      verificationFields: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      projectTimeline: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      engagementBrief: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      proposedBudget: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "rejected", "in_progress", "completed"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      tableName: "studio_request_professional",
      underscored: true,
    }
  );

  StudioRequestProfessional.associate = (models) => {
    StudioRequestProfessional.belongsTo(models.Studio, { foreignKey: "studioId", as: "studio" });
    StudioRequestProfessional.belongsTo(models.Professional, { foreignKey: "professionalId", as: "professional" });
  };

  return StudioRequestProfessional;
};
