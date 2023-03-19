'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ListClockIO extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ListClockIO.init({
    lineUid: DataTypes.STRING,
    eventType: DataTypes.STRING,
    eventTime: DataTypes.DATE,
    imageName: DataTypes.STRING,
    location: DataTypes.STRING,
    lastStep: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ListClockIO',
    freezeTableName: true
  });
  return ListClockIO;
};