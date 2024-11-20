"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TasksStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TasksStatus.tasks = TasksStatus.hasMany(models.EP_Task, {
        as: "tasks",
        foreignKey: "task_status_id",
      });
    }
  }
  TasksStatus.init(
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
      modelName: "EP_TasksStatus",
      freezeTableName: true,
    }
  );
  return TasksStatus;
};
