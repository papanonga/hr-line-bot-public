'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ListClockIO', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lineUid: {
        type: Sequelize.STRING
      },
      eventType: {
        type: Sequelize.STRING
      },
      eventTime: {
        type: Sequelize.DATE
      },
      imageName: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      lastStep: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ListClockIO');
  }
};