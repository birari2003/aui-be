"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("talent_bench", {
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
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint("talent_bench", {
      fields: ["studio_id", "professional_id"],
      type: "unique",
      name: "talent_bench_studio_professional_unique",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("talent_bench");
  },
};
