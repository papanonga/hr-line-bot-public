'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Groups extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Groups.init({
    groupId: DataTypes.STRING,
    groupName: DataTypes.STRING,
    managerId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Groups',
    freezeTableName: true

  });
  return Groups;
};