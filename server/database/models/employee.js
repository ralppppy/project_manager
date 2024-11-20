"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Employee.user = Employee.belongsTo(models.EP_User, {
        as: "user",
        foreignKey: "user_id",
      });

      Employee.department = Employee.belongsTo(models.EP_Department, {
        as: "department",
        foreignKey: "dept_id",
      });

      Employee.type = Employee.belongsTo(models.EP_UserType, {
        as: "type",
        foreignKey: "user_type_id",
      });

      Employee.menu_access = Employee.hasMany(models.EP_UserTypeMenuAccess, {
        as: "menu_access",
        sourceKey: "user_type_id",
        foreignKey: "user_type_id",
      });
    }
  }

  Employee.init(
    {
      is_super_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      user_type_id: { type: DataTypes.INTEGER, allowNull: false },
      dept_id: { type: DataTypes.INTEGER, allowNull: false },
      phone_number: { type: DataTypes.STRING, allowNull: true },
      country: { type: DataTypes.STRING, allowNull: true },
      zip_code: { type: DataTypes.STRING, allowNull: true },
      street_nr: { type: DataTypes.STRING, allowNull: true },
      city: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: "EP_Employee",
    }
  );
  return Employee;
};
