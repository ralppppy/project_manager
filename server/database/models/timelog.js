"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Timelog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Timelog.task = Timelog.belongsTo(models.EP_Task, {
        as: "task",
        foreignKey: "task_id",
      });
      Timelog.user = Timelog.belongsTo(models.EP_User, {
        as: "user",
        foreignKey: "user_id",
      });
    }
  }
  Timelog.init(
    {
      organization_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      module_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      task_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hours_worked: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "EP_Timelog",
    }
  );
  return Timelog;
};
