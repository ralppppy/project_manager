"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Department.children = Department.hasMany(models.EP_Employee, {
        as: "children",
        foreignKey: "dept_id",
      });
    }
  }
  Department.init(
    {
      organization_id: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },

      color: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      sort: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      sequelize,
      modelName: "EP_Department",
    }
  );
  return Department;
};
