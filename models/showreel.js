'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Showreel extends Model {
    static associate(models) {
      // define association here if needed
    }
  }
  Showreel.init({
    videoUrl: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    artistName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    topic: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    publicUrl: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    longMovieUrl: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true
    },
    thumbnail: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Showreel',
    tableName: 'showreels',
    underscored: true
  });
  return Showreel;
};
