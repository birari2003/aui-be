'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('professionals', 'position', {
      type: Sequelize.STRING(100),
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Note: Reverting back to ENUM might be problematic if there are custom strings
    // but this is the standard way to define the down migration.
    await queryInterface.changeColumn('professionals', 'position', {
      type: Sequelize.ENUM("artist", "lead", "supervisor", "director", "other"),
      allowNull: false
    });
  }
};
