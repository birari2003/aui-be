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
    },
    {
      tableName: "studio_job_postings",
    }
  );

  StudioJobPosting.associate = (models) => {
    StudioJobPosting.belongsTo(models.Studio, { foreignKey: "studioId", as: "studio" });
  };

  return StudioJobPosting;
};
