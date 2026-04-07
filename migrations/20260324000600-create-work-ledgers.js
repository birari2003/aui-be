"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("work_ledgers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      professional_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "professionals", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      organization_type: {
        type: Sequelize.ENUM("studio", "institute"),
        allowNull: false,
      },
      organization_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      project_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      duration: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      completion_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("work_ledgers", ["professional_id"]);
    await queryInterface.addIndex("work_ledgers", ["organization_type", "organization_id"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("work_ledgers");
  },
};
