"use strict";

module.exports = (sequelize, DataTypes) => {
  const Engagement = sequelize.define(
    "Engagement",
    {
      studioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      professionalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      projectName: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      payment: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "in_progress", "completed"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      tableName: "engagements",
    }
  );

  Engagement.associate = (models) => {
    Engagement.belongsTo(models.Studio, { foreignKey: "studioId", as: "studio" });
    Engagement.belongsTo(models.Professional, { foreignKey: "professionalId", as: "professional" });
  };

  return Engagement;
};
