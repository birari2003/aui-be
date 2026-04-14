"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add sender_role column
    await queryInterface.addColumn("special_requests", "sender_role", {
      type: Sequelize.ENUM("professional", "institute"),
      allowNull: false,
      defaultValue: "professional",
    });

    // Add institute_id column
    await queryInterface.addColumn("special_requests", "institute_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "institutes", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Make professional_id nullable
    await queryInterface.changeColumn("special_requests", "professional_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "professionals", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Add index for institute_id
    await queryInterface.addIndex("special_requests", ["institute_id"]);
  },

  async down(queryInterface, Sequelize) {
    // Revert professional_id to non-nullable (Careful: might fail if NULLs exist)
    await queryInterface.changeColumn("special_requests", "professional_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "professionals", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.removeColumn("special_requests", "institute_id");
    await queryInterface.removeColumn("special_requests", "sender_role");
    
    // Drop ENUM type
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_special_requests_sender_role";');
  },
};
