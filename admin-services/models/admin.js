'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    static associate(models) {

      Admin.belongsTo(models.Role, { foreignKey: 'role_id' });
    }
  }
  Admin.init({
    slug: DataTypes.STRING,
    username: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    password: DataTypes.STRING,
    role_id: DataTypes.BIGINT,
    is_admin: DataTypes.BOOLEAN,
    is_online: DataTypes.BOOLEAN,
    last_online: DataTypes.DATE,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Admin',
  });
  return Admin;
};