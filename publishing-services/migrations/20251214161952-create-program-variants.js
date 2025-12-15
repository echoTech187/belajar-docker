'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('program_variants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      short_description: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      image: {
        allowNull: true,
        type: Sequelize.STRING
      },
      features: {
        allowNull: true,
        type: Sequelize.JSON
      },
      background_color: {
        allowNull: true,
        type: Sequelize.STRING(10),
        defaultValue: '#FFFFFF'
      },
      text_color: {
        allowNull: true,
        type: Sequelize.STRING(10),
        defaultValue: '#000000'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('program_variants');
  }
};