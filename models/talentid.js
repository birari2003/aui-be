"use strict";

module.exports = (sequelize, DataTypes) => {
  const TalentId = sequelize.define(
    "TalentId",
    {
    professionalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    instituteId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    talentCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "talent_ids",
  }
);

TalentId.associate = (models) => {
  TalentId.belongsTo(models.Professional, { foreignKey: "professionalId", as: "professional" });
  TalentId.belongsTo(models.Institute, { foreignKey: "instituteId", as: "institute" });
};

  return TalentId;
};
