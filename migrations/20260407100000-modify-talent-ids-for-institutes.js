"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Legacy migration: userId is now handled in the base talent_ids creation.
    // This file is kept empty to maintain the migration history without causing errors.
  },

  async down(queryInterface, Sequelize) {
    // Nothing to revert
  },
};
