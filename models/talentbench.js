"use strict";

module.exports = (sequelize, DataTypes) => {
  const TalentBench = sequelize.define(
    "TalentBench",
    {
      studioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      professionalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "talent_bench",
      indexes: [
        {
          unique: true,
          fields: ["studio_id", "professional_id"],
        },
      ],
    }
  );

  TalentBench.associate = (models) => {
    TalentBench.belongsTo(models.Studio, { foreignKey: "studioId", as: "studio" });
    TalentBench.belongsTo(models.Professional, { foreignKey: "professionalId", as: "professional" });
  };

  return TalentBench;
};
