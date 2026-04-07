"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("otp_verifications", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      otp_code: {
        type: Sequelize.STRING(6),
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      consumed_at: {
        type: Sequelize.DATE,
        allowNull: true,
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

    await queryInterface.addIndex("otp_verifications", ["user_id", "otp_code"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("otp_verifications");
  },
};
