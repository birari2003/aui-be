"use strict";

module.exports = (sequelize, DataTypes) => {
  const HiringRequest = sequelize.define(
    "HiringRequest",
    {
      studioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      roleNeeded: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      numberOfArtists: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      projectType: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      duration: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      tableName: "hiring_requests",
    }
  );

  HiringRequest.associate = (models) => {
    HiringRequest.belongsTo(models.Studio, { foreignKey: "studioId", as: "studio" });
  };

  return HiringRequest;
};
