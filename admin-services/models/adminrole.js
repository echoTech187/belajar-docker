'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdminRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AdminRole.belongsTo(models.Role, { foreignKey: 'role_id' });
      AdminRole.belongsTo(models.Admin, { foreignKey: 'user_id' });
    }
  }
  AdminRole.init({
    role_id: DataTypes.BIGINT,
    user_id: DataTypes.BIGINT,
    is_allowed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'AdminRole',
  });
  return AdminRole;
};