"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("availabilities", {
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
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      is_available: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    await queryInterface.addConstraint("availabilities", {
      fields: ["professional_id", "date"],
      type: "unique",
      name: "availabilities_professional_date_unique",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("availabilities");
  },
};
