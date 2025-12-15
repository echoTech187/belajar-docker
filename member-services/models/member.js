'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Member.belongsTo(models.MemberStatus, { foreignKey: 'user_status' });
    }
  }
  Member.init({
    slug: DataTypes.STRING,
    username: DataTypes.STRING,
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    password: DataTypes.STRING,
    university_id: DataTypes.BIGINT,
    major_id: DataTypes.BIGINT,
    last_login: DataTypes.DATE,
    last_transaction: DataTypes.DATE,
    user_status: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Member',
  });
  return Member;
};