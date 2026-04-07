"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("professionals", "avatar_url", {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
    await queryInterface.addColumn("professionals", "experience_score", {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn("professionals", "reliability_score", {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn("professionals", "project_count", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("professionals", "avatar_url");
    await queryInterface.removeColumn("professionals", "experience_score");
    await queryInterface.removeColumn("professionals", "reliability_score");
    await queryInterface.removeColumn("professionals", "project_count");
  },
};
