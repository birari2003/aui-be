"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("engagements", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      studio_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "studios", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      professional_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "professionals", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      project_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      payment: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("pending", "accepted", "in_progress", "completed"),
        allowNull: false,
        defaultValue: "pending",
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

    await queryInterface.addIndex("engagements", ["status"]);
    await queryInterface.addIndex("engagements", ["studio_id"]);
    await queryInterface.addIndex("engagements", ["professional_id"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("engagements");
  },
};
