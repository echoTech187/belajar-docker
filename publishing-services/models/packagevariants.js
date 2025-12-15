'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PackageVariants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PackageVariants.belongsTo(models.PackegeDiscounts, {
        foreignKey: 'discount_id',
        as: 'discount'
      });
      PackageVariants.belongsTo(models.FormVariants, {
        foreignKey: 'form_variant_id',
        as: 'form_variant'
      });
      PackageVariants.belongsTo(models.ProgramVariants, {
        foreignKey: 'program_variant_id',
        as: 'program_variant'
      });
    }
  }
  PackageVariants.init({
    program_variant_id: DataTypes.INTEGER,
    form_variant_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    short_description: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL(10, 2),
    discount_id: DataTypes.INTEGER,
    services_fee: DataTypes.DECIMAL(10, 2),
    image: DataTypes.STRING,
    background_color: DataTypes.STRING(10),
    text_color: DataTypes.STRING(10),
    features: DataTypes.JSON,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'PackageVariants',
  });
  return PackageVariants;
};