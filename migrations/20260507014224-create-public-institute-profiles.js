'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('public_institute_profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      logo: { type: Sequelize.STRING },
      banner_image: { type: Sequelize.STRING },
      name: { type: Sequelize.STRING, allowNull: false },
      tagline: { type: Sequelize.STRING },
      location: { type: Sequelize.STRING },
      website: { type: Sequelize.STRING },
      about: { type: Sequelize.TEXT },
      
      // Stats Bar
      est_year: { type: Sequelize.INTEGER },
      students_trained: { type: Sequelize.STRING }, // "8,500+"
      industry_mentors: { type: Sequelize.STRING },
      placement_rate: { type: Sequelize.STRING },
      partner_studios: { type: Sequelize.STRING },
      alumni_working: { type: Sequelize.STRING },
      
      // Partnership Stats
      workshops_conducted: { type: Sequelize.INTEGER, defaultValue: 0 },
      mentorship_sessions: { type: Sequelize.INTEGER, defaultValue: 0 },
      portfolio_reviews: { type: Sequelize.INTEGER, defaultValue: 0 },
      
      // Complex Sections (JSON)
      features: { type: Sequelize.JSON }, // [{ title, description, icon }]
      showcase_video_url: { type: Sequelize.STRING },
      programs: { type: Sequelize.JSON }, // [{ name, duration, type, thumbnail }]
      why_choose_us: { type: Sequelize.JSON }, // ["Industry-relevant curriculum", ...]
      industry_partners: { type: Sequelize.JSON }, // [logo_path, ...]
      testimonials: { type: Sequelize.JSON }, // [{ name, role, text, photo }]
      
      // Contact Info
      email: { type: Sequelize.STRING },
      phone: { type: Sequelize.STRING },
      address: { type: Sequelize.TEXT },
      office_hours: { type: Sequelize.STRING },
      social_links: { type: Sequelize.JSON }, // { linkedin, instagram, youtube, twitter }
      
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
    await queryInterface.dropTable('public_institute_profiles');
  }
};
