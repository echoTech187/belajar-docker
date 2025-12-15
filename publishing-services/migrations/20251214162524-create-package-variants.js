'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('package_variants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      program_variant_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'program_variants',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      form_variant_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'form_variants',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      short_description: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      price: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2)
      },
      discount_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'packege_discounts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      services_fee: {
        allowNull: true,
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      image: {
        allowNull: true,
        type: Sequelize.STRING,
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
      features: {
        allowNull: true,
        type: Sequelize.JSON
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
        type: Sequelize.DATE,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('package_variants');
  }
};