"use strict";

module.exports = (sequelize, DataTypes) => {
  const WorkLedger = sequelize.define(
    "WorkLedger",
    {
      professionalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      organizationType: {
        type: DataTypes.ENUM("studio", "institute"),
        allowNull: false,
      },
      organizationId: {
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
      duration: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      completionDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      tableName: "work_ledgers",
    }
  );

  WorkLedger.associate = (models) => {
    WorkLedger.belongsTo(models.Professional, { foreignKey: "professionalId", as: "professional" });
  };

  return WorkLedger;
};
