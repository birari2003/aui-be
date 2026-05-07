"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("public_professional_profiles", "profileImage", "profile_image");
    await queryInterface.renameColumn("public_professional_profiles", "workLedgerImage", "work_ledger_image");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("public_professional_profiles", "profile_image", "profileImage");
    await queryInterface.renameColumn("public_professional_profiles", "work_ledger_image", "workLedgerImage");
  },
};
