'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WorkshopRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  WorkshopRequest.init({
    instituteId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    workshopId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    workshopTitle: DataTypes.STRING,
    category: DataTypes.STRING,
    studentCount: DataTypes.STRING,
    preferredMonth: DataTypes.STRING,
    contactPerson: DataTypes.STRING,
    email: DataTypes.STRING,
    specialRequirements: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    },
    requestType: {
      type: DataTypes.ENUM('workshop', 'artist'),
      allowNull: false,
      defaultValue: 'workshop',
      field: 'request_type'
    },
    professionalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'professional_id'
    }
  }, {
    sequelize,
    modelName: 'WorkshopRequest',
    tableName: 'workshop_requests',
    underscored: true,
  });

  WorkshopRequest.associate = (models) => {
    WorkshopRequest.belongsTo(models.Institute, {
      foreignKey: 'instituteId',
      as: 'institute'
    });
    WorkshopRequest.belongsTo(models.InstituteWorkshop, {
      foreignKey: 'workshopId',
      as: 'workshop'
    });
    WorkshopRequest.belongsTo(models.Professional, {
      foreignKey: 'professionalId',
      as: 'professional'
    });
  };
  return WorkshopRequest;
};