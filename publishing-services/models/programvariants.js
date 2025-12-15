'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProgramVariants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProgramVariants.hasMany(models.PackageVariants, {
        foreignKey: 'program_variant_id',
        as: 'package_variants'
      });
    }
  }
  ProgramVariants.init({
    name: DataTypes.STRING,
    short_description: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    features: DataTypes.JSON,
    background_color: DataTypes.STRING(10),
    text_color: DataTypes.STRING(10),
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ProgramVariants',
  });
  return ProgramVariants;
};