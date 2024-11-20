"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      File.comment = File.belongsTo(models.EP_TaskComment, {
        as: "comment",
        foreignKey: "comment_id",
      });

      File.task = File.belongsTo(models.EP_Task, {
        as: "task",
        foreignKey: "task_id",
      });
    }
  }
  File.init(
    {
      organization_id: DataTypes.INTEGER,
      organization_id: {
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
      client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      task_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      uploader_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      file_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "EP_File",
    }
  );
  return File;
};
