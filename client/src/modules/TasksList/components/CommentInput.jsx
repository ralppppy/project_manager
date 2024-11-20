import { Mentions, theme } from "antd";
import React, { useRef, useState } from "react";
import { SendOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";
import { TaskListController } from "../controllers";
import { useDispatch, useSelector } from "react-redux";
import { setComment } from "../models/TasksListModel";
function CommentInput({
  commentRef,
  mentionRef,
  currentRef,
  form,
  isInternal,
}) {
  const dispatch = useDispatch();
  const comment = useSelector((state) => state.taskList.comment);
  const reply_to_id = useSelector((state) => state.taskList.reply_to_id);

  const queryClient = useQueryClient();
  const updateData = useSelector((state) => state.taskList.updateData);
  const user = useSelector((state) => state.login.user);
  const { handleCreateComment } = TaskListController({
    queryClient,
    dispatch,
  });
  const TASK_COMMENT_KEY = [
    "task_comment",
    user.organization_id,
    updateData.id,
    isInternal,
  ];
  const { mutate } = useMutation({
    mutationFn: handleCreateComment,
    // onSuccess: handleSuccessCreateTask,
  });

  const { token } = theme.useToken();
  const onChange = (value) => {
    dispatch(setComment(value));
  };

  const onSelect = (option) => {
    console.log("select", option);
  };

  // let team = form.getFieldValue("team")

  let team = form.getFieldValue("team")?.map((c) => ({
    value: `${c.first_name}${c.last_name}`,
    label: `${c.first_name}${c.last_name}`,
    key: `${c.id}`,
    user_id: c.user.id,
  }));

  return (
    <div
      style={{
        border: "1px solid #e3e3e3",
        borderRadius: token.borderRadius,
        display: "flex",
        flexDirection: "row",
      }}
      className="input-comment"
    >
      <Mentions
        style={{
          border: "none",
          width: "100%",
        }}
        ref={mentionRef}
        value={comment}
        onChange={onChange}
        onSelect={onSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            let modifiedCommentText = comment;
            team.forEach((team) => {
              const mentionPattern = new RegExp(`@${team.value}`, "g");
              modifiedCommentText = modifiedCommentText.replace(
                mentionPattern,
                `@${team.user_id}`
              );
            });

            modifiedCommentText = modifiedCommentText.trim();

            if (modifiedCommentText.length > 0) {
              let params = {
                comment: modifiedCommentText,
                commenter_id: user.id,
                task_id: updateData.id,
                reply_to_id: null,
                organization_id: user.organization_id,
                reply_to_id: reply_to_id,
                is_internal: isInternal,
              };
              mutate({ params, TASK_COMMENT_KEY, commentRef, currentRef });
            }
          }
        }}
        suffix={<SendOutlined />}
        placeholder="Enter you comment"
        options={team}
      />

      <SendOutlined className="m-1" style={{ fontSize: 15 }} />
    </div>
  );
}

export default React.memo(CommentInput);
