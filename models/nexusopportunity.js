'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NexusOpportunity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NexusOpportunity.init({
    title: DataTypes.STRING,
    date: DataTypes.STRING,
    limit: DataTypes.STRING,
    tag: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'NexusOpportunity',
    tableName: 'nexus_opportunities',
    underscored: true
  });
  return NexusOpportunity;
};