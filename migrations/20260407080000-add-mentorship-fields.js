'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('professionals', 'workshops_conducted', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('professionals', 'mentorship_sessions', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('professionals', 'portfolio_reviews', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('professionals', 'workshops_conducted');
    await queryInterface.removeColumn('professionals', 'mentorship_sessions');
    await queryInterface.removeColumn('professionals', 'portfolio_reviews');
  }
};
