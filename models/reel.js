"use strict";

module.exports = (sequelize, DataTypes) => {
  const Reel = sequelize.define(
    "Reel",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("mentor", "studio", "institute"),
        allowNull: false,
      },
      videoUrl: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "reels",
    }
  );

  Reel.associate = (models) => {
    Reel.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return Reel;
};
