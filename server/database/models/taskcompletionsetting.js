"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TaskCompletionSetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TaskCompletionSetting.init(
    {
      organization_id: { type: DataTypes.INTEGER, allowNull: false },
      task_status_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "EP_TaskCompletionSetting",
    }
  );
  return TaskCompletionSetting;
};
