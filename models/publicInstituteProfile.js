'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PublicInstituteProfile extends Model {
    static associate(models) {
      PublicInstituteProfile.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  PublicInstituteProfile.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    logo: DataTypes.STRING,
    bannerImage: DataTypes.STRING,
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tagline: DataTypes.STRING,
    location: DataTypes.STRING,
    website: DataTypes.STRING,
    about: DataTypes.TEXT,
    
    // Stats Bar
    estYear: DataTypes.INTEGER,
    studentsTrained: DataTypes.STRING,
    industryMentors: DataTypes.STRING,
    placementRate: DataTypes.STRING,
    partnerStudios: DataTypes.STRING,
    alumniWorking: DataTypes.STRING,
    
    // Partnership Stats
    workshopsConducted: DataTypes.INTEGER,
    mentorshipSessions: DataTypes.INTEGER,
    portfolioReviews: DataTypes.INTEGER,
    
    // Complex Sections (JSON)
    features: DataTypes.JSON,
    showcaseVideoUrl: DataTypes.STRING,
    programs: DataTypes.JSON,
    whyChooseUs: DataTypes.JSON,
    industryPartners: DataTypes.JSON,
    testimonials: DataTypes.JSON,
    
    // Contact Info
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.TEXT,
    officeHours: DataTypes.STRING,
    socialLinks: DataTypes.JSON,
  }, {
    sequelize,
    modelName: 'PublicInstituteProfile',
    tableName: 'public_institute_profiles',
    underscored: true,
  });
  return PublicInstituteProfile;
};
