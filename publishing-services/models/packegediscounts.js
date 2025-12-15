'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PackegeDiscounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PackegeDiscounts.hasMany(models.PackageVariants, {
        foreignKey: 'discount_id',
        as: 'package_variants'
      });
    }
  }
  PackegeDiscounts.init({
    discount_code: DataTypes.STRING,
    discount_title: DataTypes.STRING,
    description: DataTypes.STRING,
    discount_nominal: DataTypes.DECIMAL(10, 2),
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'PackegeDiscounts',
  });
  return PackegeDiscounts;
};