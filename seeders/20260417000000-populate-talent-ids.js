"use strict";

const { QueryTypes } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Fetch all users
    const users = await queryInterface.sequelize.query(
      "SELECT id, role FROM users",
      { type: QueryTypes.SELECT }
    );

    const now = new Date();

    for (const user of users) {
      if (user.role === "admin") continue;

      // 2. Determine talentCode
      let talentCodePrefix = "";
      if (user.role === "professional") talentCodePrefix = "AUI-";
      else if (user.role === "institute") talentCodePrefix = "AUI-INST-";
      else if (user.role === "studio") talentCodePrefix = "AUI-STU-";
      else continue;

      const talentCode = `${talentCodePrefix}${String(user.id).padStart(6, "0")}`;

      // 3. Insert into talent_ids if not exists
      const existingTalentId = await queryInterface.sequelize.query(
        "SELECT id FROM talent_ids WHERE user_id = ?",
        { replacements: [user.id], type: QueryTypes.SELECT }
      );

      if (existingTalentId.length === 0) {
        await queryInterface.bulkInsert("talent_ids", [
          {
            user_id: user.id,
            talent_code: talentCode,
            created_at: now,
            updated_at: now,
          },
        ]);
      }

      // 4. Update collaboration_requests for this user (if they are the sender)
      // Since CollaborationRequest.senderRole determines which ID (professionalId/instituteId) is the sender,
      // we need to find the professional/institute record for this user first.
      
      let platformPath = "";
      if (user.role === "professional") {
        platformPath = `talent/${talentCode}`;
        const profs = await queryInterface.sequelize.query(
          "SELECT id FROM professionals WHERE user_id = ?",
          { replacements: [user.id], type: QueryTypes.SELECT }
        );
        if (profs.length > 0) {
          const profId = profs[0].id;
          await queryInterface.sequelize.query(
            "UPDATE collaboration_requests SET public_url = ? WHERE professional_id = ? AND sender_role = 'professional'",
            { replacements: [platformPath, profId] }
          );
          await queryInterface.sequelize.query(
            "UPDATE special_requests SET professional_public_url = ? WHERE professional_id = ?",
            { replacements: [platformPath, profId] }
          );
        }
      } else if (user.role === "institute") {
        platformPath = `institute/${talentCode}`;
        const insts = await queryInterface.sequelize.query(
          "SELECT id FROM institutes WHERE user_id = ?",
          { replacements: [user.id], type: QueryTypes.SELECT }
        );
        if (insts.length > 0) {
          const instId = insts[0].id;
          await queryInterface.sequelize.query(
            "UPDATE collaboration_requests SET public_url = ? WHERE institute_id = ? AND sender_role = 'institute'",
            { replacements: [platformPath, instId] }
          );
          await queryInterface.sequelize.query(
            "UPDATE special_requests SET institute_public_url = ? WHERE institute_id = ?",
            { replacements: [platformPath, instId] }
          );
        }
      } else if (user.role === "studio") {
        platformPath = `studio/${talentCode}`;
        // Studios don't have public profiles currently, but we can store the talentCode for internal links
        // If there were any special internal links for studios, we would update them here.
      }
    }
  },

  async down(queryInterface, Sequelize) {
    // Reverting might be complex as it involves manual data changes.
    // For now, we'll leave it empty to avoid accidental data loss.
  },
};
