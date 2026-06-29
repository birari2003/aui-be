'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('showreels', 'slug', {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('showreels', 'slug');
  }
};
