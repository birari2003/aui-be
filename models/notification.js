'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Notification.belongsTo(models.Studio, { foreignKey: 'studioId', as: 'studio' });
    }
  }
  Notification.init({
    userId: DataTypes.INTEGER,
    studioId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    message: DataTypes.TEXT,
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    underscored: true,
  });
  return Notification;
};
