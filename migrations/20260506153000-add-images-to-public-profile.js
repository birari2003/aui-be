"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("public_professional_profiles", "profile_image", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("public_professional_profiles", "work_ledger_image", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("public_professional_profiles", "profile_image");
    await queryInterface.removeColumn("public_professional_profiles", "work_ledger_image");
  },
};
