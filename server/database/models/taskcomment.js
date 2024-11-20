"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TaskComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TaskComment.task = TaskComment.belongsTo(models.EP_Task, {
        as: "task",
        foreignKey: "task_id",
      });
      TaskComment.commenter = TaskComment.belongsTo(models.EP_User, {
        as: "commenter",
        foreignKey: "commenter_id",
      });

      TaskComment.reply = TaskComment.belongsTo(models.EP_TaskComment, {
        as: "reply",
        foreignKey: "reply_to_id",
      });
      TaskComment.replies = TaskComment.hasMany(models.EP_TaskComment, {
        as: "replies",
        foreignKey: "reply_to_id",
      });

      TaskComment.attachments = TaskComment.hasMany(models.EP_File, {
        as: "attachments",
        foreignKey: "comment_id",
      });

      TaskComment.reply_attachments = TaskComment.hasMany(models.EP_File, {
        as: "reply_attachments",
        foreignKey: "comment_id",
      });
    }
  }
  TaskComment.init(
    {
      comment: { type: DataTypes.TEXT("LONG"), allowNull: false },
      commenter_id: { type: DataTypes.INTEGER, allowNull: false },
      task_id: { type: DataTypes.INTEGER, allowNull: false },
      is_internal: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      reply_to_id: { type: DataTypes.INTEGER, allowNull: true },
      organization_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "EP_TaskComment",
    }
  );
  return TaskComment;
};
