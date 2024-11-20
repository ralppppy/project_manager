"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      UserType.users = UserType.hasMany(models.EP_Employee, {
        as: "users",
        foreignKey: "user_type_id",
      });

      UserType.employee = UserType.hasOne(models.EP_Employee, {
        as: "employee",
        foreignKey: "user_type_id",
      });

      UserType.menu_access = UserType.hasMany(models.EP_UserTypeMenuAccess, {
        as: "menu_access",
        foreignKey: "user_type_id",
      });
    }
  }

  UserType.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      organization_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sort: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      sequelize,
      modelName: "EP_UserType",
    }
  );
  return UserType;
};
