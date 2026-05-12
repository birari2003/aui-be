'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('workshop_requests', 'request_type', {
      type: Sequelize.ENUM('workshop', 'artist'),
      allowNull: false,
      defaultValue: 'workshop'
    });
    await queryInterface.addColumn('workshop_requests', 'professional_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'professionals',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('workshop_requests', 'request_type');
    await queryInterface.removeColumn('workshop_requests', 'professional_id');
    // Note: To truly undo ENUM addition in MySQL you might need extra steps, 
    // but removeColumn usually works or requires manual SQL for ENUM cleanup.
  }
};
