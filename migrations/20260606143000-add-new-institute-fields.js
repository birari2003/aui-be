"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("institutes", "services_required", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("institutes", "official_links", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("institutes", "services_required");
    await queryInterface.removeColumn("institutes", "official_links");
  },
};
