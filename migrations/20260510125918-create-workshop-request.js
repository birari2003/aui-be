'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('workshop_requests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      institute_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'institutes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      workshop_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'institute_workshops',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      workshop_title: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      student_count: {
        type: Sequelize.STRING
      },
      preferred_month: {
        type: Sequelize.STRING
      },
      contact_person: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      special_requirements: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('workshop_requests');
  }
};