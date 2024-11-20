"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TasksTeam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      TasksTeam.task = TasksTeam.belongsTo(models.EP_TasksStatus, {
        as: "task",
        foreignKey: "task_id",
      });

      TasksTeam.tasks = TasksTeam.belongsTo(models.EP_Task, {
        as: "tasks",
        foreignKey: "task_id",
      });

      TasksTeam.user = TasksTeam.belongsTo(models.EP_User, {
        as: "user",
        foreignKey: "user_id",
      });

      TasksTeam.project_role = TasksTeam.belongsTo(models.EP_ProjectRole, {
        as: "project_role",
        foreignKey: "project_role_id",
      });
    }
  }
  TasksTeam.init(
    {
      project_id: { type: DataTypes.INTEGER, allowNull: false },
      task_id: { type: DataTypes.INTEGER, allowNull: false },
      client_id: { type: DataTypes.INTEGER, allowNull: false },
      module_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      organization_id: { type: DataTypes.INTEGER, allowNull: false },
      project_role_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "EP_TasksTeam",
    }
  );
  return TasksTeam;
};
