"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProjectRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProjectRole.project_team = ProjectRole.belongsTo(models.EP_ProjectTeam, {
        as: "project_team",
        foreignKey: "project_role_id",
      });
      ProjectRole.module_team = ProjectRole.belongsTo(models.EP_ModuleTeam, {
        as: "module_team",
        foreignKey: "project_role_id",
      });

      ProjectRole.task_team = ProjectRole.belongsTo(models.EP_TasksTeam, {
        as: "task_team",
        foreignKey: "project_role_id",
      });
    }
  }
  ProjectRole.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      organization_id: { type: DataTypes.STRING, allowNull: false },
      color: { type: DataTypes.STRING, allowNull: true },
      sort: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      sequelize,
      modelName: "EP_ProjectRole",
    }
  );
  return ProjectRole;
};
