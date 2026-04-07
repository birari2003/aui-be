'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('studios', 'website', {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
    await queryInterface.changeColumn('institutes', 'website', {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('studios', 'website', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.changeColumn('institutes', 'website', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  }
};
