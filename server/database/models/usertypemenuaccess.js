"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserTypeMenuAccess extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserTypeMenuAccess.UserType = UserTypeMenuAccess.belongsTo(
        models.EP_UserType,
        {
          as: "user_type",
          foreignKey: "user_type_id",
        }
      );

      UserTypeMenuAccess.employee = UserTypeMenuAccess.belongsTo(
        models.EP_Employee,
        {
          as: "employee",
          foreignKey: "user_type_id",
          targetKey: "user_type_id", // This is the target key in the Employee table
        }
      );
    }
  }
  UserTypeMenuAccess.init(
    {
      is_lock: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      menu_key_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      organization_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sort: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "EP_UserTypeMenuAccess",
    }
  );
  return UserTypeMenuAccess;
};
