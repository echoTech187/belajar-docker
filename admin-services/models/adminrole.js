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
      AdminRole.belongsTo(models.Role, { foreignKey: 'roleId' });
      AdminRole.belongsTo(models.Admin, { foreignKey: 'UserId' });
    }
  }
  AdminRole.init({
    roleId: DataTypes.BIGINT,
    UserId: DataTypes.BIGINT,
    isAllowed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'AdminRole',
  });
  return AdminRole;
};