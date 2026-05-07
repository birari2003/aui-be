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
      projectTimeline: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      productionType: {
        type: DataTypes.ENUM("film", "tv", "web", "ads", "other"),
        allowNull: false,
        defaultValue: "film",
      },
      engagementBrief: {
        type: DataTypes.TEXT,
        allowNull: false,
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
    }
  );

  StudioRequestProfessional.associate = (models) => {
    StudioRequestProfessional.belongsTo(models.Studio, { foreignKey: "studioId", as: "studio" });
    StudioRequestProfessional.belongsTo(models.Professional, { foreignKey: "professionalId", as: "professional" });
  };

  return StudioRequestProfessional;
};
