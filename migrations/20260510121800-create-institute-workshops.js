"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("institute_workshops", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      level: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pillars: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      outcome: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      rate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      model_type: {
        type: Sequelize.ENUM("workshops", "mentorship", "portfolio"),
        allowNull: false,
        defaultValue: "workshops",
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("institute_workshops");
  },
};
