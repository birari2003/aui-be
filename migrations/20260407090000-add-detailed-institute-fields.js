"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("institutes", "avatar_url", {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
    await queryInterface.addColumn("institutes", "banner_url", {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
    await queryInterface.addColumn("institutes", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("institutes", "established_year", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("institutes", "avatar_url");
    await queryInterface.removeColumn("institutes", "banner_url");
    await queryInterface.removeColumn("institutes", "description");
    await queryInterface.removeColumn("institutes", "established_year");
  },
};
