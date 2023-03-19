'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Activations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Activations.init({
    registerKey: DataTypes.STRING,
    userId: DataTypes.STRING,
    isUsed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Activations',
    freezeTableName: true
  });
  return Activations;
};