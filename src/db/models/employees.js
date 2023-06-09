'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employees extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Employees.init({
    userId: DataTypes.STRING,
    lineUid: DataTypes.STRING,
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    groupId: DataTypes.STRING,
    joinDate: DataTypes.DATE,
    contractType: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Employees',
    freezeTableName: true

  });
  return Employees;
};