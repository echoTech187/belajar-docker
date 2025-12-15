'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FormVariants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FormVariants.hasMany(models.PackageVariants, {
        foreignKey: 'form_variant_id',
        as: 'package_variants'
      });
    }
  }
  FormVariants.init({
    form_variant_name: DataTypes.STRING,
    attributes: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'FormVariants',
  });
  return FormVariants;
};