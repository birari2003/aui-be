"use strict";

module.exports = (sequelize, DataTypes) => {
  const AspirantShare = sequelize.define(
    "AspirantShare",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      instituteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        field: 'instituteId'
      },
    },
    {
      tableName: "aspirant_shares",
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  );

  AspirantShare.associate = (models) => {
    AspirantShare.belongsTo(models.Institute, { foreignKey: "instituteId", as: "institute" });
  };

  return AspirantShare;
};
