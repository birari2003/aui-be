"use strict";

module.exports = (sequelize, DataTypes) => {
  const AspirantShare = sequelize.define(
    "AspirantShare",
    {
      instituteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "aspirant_shares",
    }
  );

  AspirantShare.associate = (models) => {
    AspirantShare.belongsTo(models.Institute, { foreignKey: "instituteId", as: "institute" });
  };

  return AspirantShare;
};
