"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("studio_job_postings", "role", {
      type: Sequelize.STRING(150),
      allowNull: true,
    });
    await queryInterface.addColumn("studio_job_postings", "price", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("studio_job_postings", "role");
    await queryInterface.removeColumn("studio_job_postings", "price");
  },
};
