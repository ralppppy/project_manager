"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GanttChart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      GanttChart.task = GanttChart.belongsTo(models.EP_Task, {
        as: "task",
        foreignKey: "task_id",
      });

      GanttChart.user = GanttChart.belongsTo(models.EP_User, {
        as: "user",
        foreignKey: "user_id",
      });

      GanttChart.module = GanttChart.belongsTo(models.EP_Module, {
        as: "module",
        foreignKey: "module_id",
      });
    }
  }
  GanttChart.init(
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
        allowNull: false,
      },
      task_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      modelName: "EP_GanttChart",
    }
  );
  return GanttChart;
};
