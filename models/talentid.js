"use strict";

module.exports = (sequelize, DataTypes) => {
  const TalentId = sequelize.define(
    "TalentId",
    {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  TalentId.belongsTo(models.User, { foreignKey: "userId", as: "user" });
};

  return TalentId;
};
