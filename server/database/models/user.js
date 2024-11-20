"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.projectTeams = User.hasMany(models.EP_ProjectTeam, {
        as: "projectTeams",
        foreignKey: "user_id",
      });
      User.taskTeams = User.hasMany(models.EP_TasksTeam, {
        as: "taskTeams",
        foreignKey: "user_id",
      });

      User.tasks = User.hasMany(models.EP_Task, {
        as: "tasks",
        foreignKey: "creator_id",
      });

      User.module_team = User.hasMany(models.EP_ModuleTeam, {
        as: "module_team",
        foreignKey: "user_id",
      });
      User.comments = User.hasMany(models.EP_TaskComment, {
        as: "comments",
        foreignKey: "commenter_id",
      });

      User.gantt_chart_data = User.hasMany(models.EP_GanttChart, {
        as: "gantt_chart_data",
        foreignKey: "user_id",
      });

      User.gantt_chart_data_child = User.hasMany(models.EP_GanttChart, {
        as: "gantt_chart_data_child",
        foreignKey: "user_id",
      });

      User.employee = User.hasOne(models.EP_Employee, {
        as: "employee",
        foreignKey: "user_id",
      });
      User.client = User.hasOne(models.EP_ClientUser, {
        as: "client",
        foreignKey: "user_id",
      });

      User.timelogs = User.hasMany(models.EP_Timelog, {
        as: "timelogs",
        foreignKey: "user_id",
      });
    }
  }

  User.init(
    {
      first_name: { type: DataTypes.STRING, allowNull: false },
      last_name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.TEXT, allowNull: true },
      organization_id: { type: DataTypes.INTEGER, allowNull: true },
      is_employee: { type: DataTypes.BOOLEAN, allowNull: false },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false },
      verification_token: { type: DataTypes.TEXT, allowNull: true },
      reset_password_token: { type: DataTypes.TEXT, allowNull: true },
      sort: { type: DataTypes.TEXT, allowNull: false },
      active_security: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      sequelize,
      modelName: "EP_User",

      // defaultScope: {
      //   attributes: { exclude: ["password"] },
      // },
    }
  );
  return User;
};
