"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Module.modules = Module.belongsTo(models.EP_Project, {
        as: "modules",
        foreignKey: "project_id",
      });

      Module.team = Module.hasMany(models.EP_ModuleTeam, {
        as: "team",
        foreignKey: "module_id",
      });
      Module.module_team_emtpy = Module.hasMany(models.EP_ModuleTeam, {
        as: "module_team_emtpy",
        foreignKey: "module_id",
      });

      Module.project = Module.belongsTo(models.EP_Project, {
        as: "project",
        foreignKey: "project_id",
      });

      Module.children = Module.hasMany(models.EP_Task, {
        as: "children",
        foreignKey: "module_id",
      });

      Module.tasks = Module.hasMany(models.EP_Task, {
        as: "tasks",
        foreignKey: "module_id",
      });

      Module.gantt_chart_data = Module.hasMany(models.EP_GanttChart, {
        as: "gantt_chart_data",
        foreignKey: "module_id",
      });
    }
  }
  Module.init(
    {
      client_id: { type: DataTypes.INTEGER, allowNull: false },
      project_id: { type: DataTypes.INTEGER, allowNull: false },
      organization_id: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: false },
      active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      sequelize,
      modelName: "EP_Module",
    }
  );
  return Module;
};
