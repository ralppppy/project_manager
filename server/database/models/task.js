"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Task.creator = Task.belongsTo(models.EP_User, {
        as: "creator",
        foreignKey: "creator_id",
      });
      Task.client = Task.belongsTo(models.EP_Client, {
        as: "client",
        foreignKey: "client_id",
      });
      Task.project = Task.belongsTo(models.EP_Project, {
        as: "project",
        foreignKey: "project_id",
      });
      Task.module = Task.belongsTo(models.EP_Module, {
        as: "module",
        foreignKey: "module_id",
      });

      Task.task_type = Task.belongsTo(models.EP_TasksType, {
        as: "task_type",
        foreignKey: "task_type_id",
      });
      Task.task_priority = Task.belongsTo(models.EP_TasksPriority, {
        as: "task_priority",
        foreignKey: "task_priority_id",
      });
      Task.task_status = Task.belongsTo(models.EP_TasksStatus, {
        as: "task_status",
        foreignKey: "task_status_id",
      });

      Task.child_tasks = Task.hasMany(models.EP_Task, {
        as: "child_tasks",
        foreignKey: "connected_to_id",
        sourceKey: "connected_to_id",
      });

      // Task.children = Task.hasMany(models.EP_Task, {
      //   as: "children",
      //   foreignKey: "connected_to_id",
      //   sourceKey: "connected_to_id",
      // });

      Task.parent_task = Task.belongsTo(models.EP_Task, {
        as: "parent_task",
        foreignKey: "connected_to_id",
        sourceKey: "connected_to_id",
      });

      Task.team = Task.hasMany(models.EP_TasksTeam, {
        as: "team",
        foreignKey: "task_id",
      });
      Task.team_empty = Task.hasMany(models.EP_TasksTeam, {
        as: "team_empty",
        foreignKey: "task_id",
      });

      Task.children = Task.hasMany(models.EP_Task, {
        as: "children",
        foreignKey: "connected_to_id",
        // sourceKey: "connected_to_id",
      });
      Task.par = Task.belongsTo(models.EP_Task, {
        as: "par",
        foreignKey: "connected_to_id",
        // sourceKey: "connected_to_id",
      });

      Task.gantt_chart_data = Task.hasMany(models.EP_GanttChart, {
        as: "gantt_chart_data",
        foreignKey: "task_id",
      });

      Task.timelog_data = Task.hasMany(models.EP_Timelog, {
        as: "timelog_data",
        foreignKey: "task_id",
      });
      Task.timelog_data_project = Task.hasMany(models.EP_Timelog, {
        as: "timelog_data_project",
        foreignKey: "task_id",
      });

      Task.comments = Task.hasMany(models.EP_TaskComment, {
        as: "comments",
        foreignKey: "task_id",
      });

      Task.attachments = Task.hasMany(models.EP_File, {
        as: "attachments",
        foreignKey: "task_id",
      });
    }
  }
  Task.init(
    {
      module_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
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
      task_priority_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      task_status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      task_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      connected_to_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      task_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      creator_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_approved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      time_estimate: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_time_estimate_approved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      hours_worked: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_feedback: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      instruction: {
        type: DataTypes.TEXT("LONG"),
        allowNull: true,
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "EP_Task",
    }
  );
  return Task;
};
