import { Avatar, Popconfirm, theme, Tooltip, Typography } from "antd";
import { Comment } from "@ant-design/compatible";

import React, { useRef } from "react";
import {
  UploadOutlined,
  PaperClipOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./styles.css";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import relativeTime from "dayjs/plugin/relativeTime";
import { setComment, setReplyToId } from "../models/TasksListModel";
import { TaskListController } from "../controllers";
import { useMutation, useQueryClient } from "react-query";
dayjs.extend(relativeTime);
const { Text, Paragraph } = Typography;
function CommentComponent({
  children,
  item,
  mentionRef,
  commentParent,
  className = "",
  setCurrentRef,
  form,
  isInternal,
  updateData,
  messageApi,
  isReply = false,
}) {
  const user = useSelector((state) => state.login.user);
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );
  const dispatch = useDispatch();

  const TASK_COMMENT_KEY = [
    "task_comment",
    user.organization_id,
    updateData.id,
    isInternal,
  ];

  const queryClient = useQueryClient();

  const { handleDrawerState, handleDeleteComment } = TaskListController({
    dispatch,
    queryClient,
    messageApi,
  });
  const { token } = theme.useToken(0);

  const ref = useRef();

  let team = form.getFieldValue("team")?.map((c) => ({
    ...c,
    value: `${c.first_name}${c.last_name}`,
    label: `${c.first_name}${c.last_name}`,
    key: `${c.id}`,
    user_id: c.user.id,
  }));

  const originalString = item.comment;

  let modifiedCommentText = originalString;

  const parts = modifiedCommentText.split(/(@\w+)/);

  const renderReply = (team, item) => {
    let currentCommentingUser = team?.find(
      (c) => c.user_id === item.commenter.id
    );

    if (currentCommentingUser) {
      return (
        <span
          onClick={() => {
            // let currentCommentingUser = team.find(
            //   (c) => c.user_id === item.commenter.id
            // );

            dispatch(setComment(`@${currentCommentingUser.label} `));

            if (commentParent) {
              dispatch(setReplyToId(commentParent.id));
            } else {
              dispatch(setReplyToId(item.id));
            }

            setCurrentRef(ref);
            mentionRef.current.textarea.focus();
          }}
          key="comment-nested-reply-to"
        >
          <Text style={{ fontSize: 10 }}>Reply</Text>
        </span>
      );
    } else {
      return (
        <Tooltip title="You cannot reply to user not part of the task.">
          <Text disabled type="danger" style={{ fontSize: 10 }}>
            Reply
          </Text>
        </Tooltip>
      );
    }
  };

  const { mutate } = useMutation({
    mutationFn: handleDeleteComment,
  });

  return (
    <>
      <div ref={ref}></div>

      <Comment
        style={{
          backgroundColor: token.colorBgContainer,
          color: token.colorText,
          padding: token.padding,
          borderRadius: token.borderRadius,
        }}
        className={className}
        actions={[
          renderReply(team, item),

          item.commenter.id === user.id && (
            <span
              onClick={() => {
                handleDrawerState(true, item, false, commentParent, isInternal);
              }}
              key="comment-nested-reply-to"
            >
              <UploadOutlined style={{ color: token.colorText }} />{" "}
              <Text style={{ fontSize: 10 }}>Upload File</Text>
            </span>
          ),
          <span
            onClick={() => {
              handleDrawerState(true, item, true, commentParent, isInternal);
            }}
            key="comment-nested-reply-to"
          >
            <PaperClipOutlined style={{ color: token.colorText }} />{" "}
            <Text style={{ fontSize: 10 }}>
              Attachments ({item.attachmentsCount || 0})
            </Text>
          </span>,
          item.commenter.id === user.id &&
            parseInt(item.attachmentsCount || 0) === 0 &&
            (Array.isArray(item.replies)
              ? item.replies.length === 0
              : true) && (
              <span
                // onClick={() => {
                //   handleDrawerState(true, item, true, commentParent);
                // }}

                key="comment-nested-reply-to"
              >
                <Popconfirm
                  title="Delete comment"
                  description="Are you sure to delete this comment?"
                  onConfirm={() =>
                    mutate({ item, organization_id, TASK_COMMENT_KEY, isReply })
                  }
                  placement="bottomLeft"
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined style={{ color: "#dc4446" }} />{" "}
                  <Text type="danger" style={{ fontSize: 10 }}>
                    Delete
                  </Text>
                </Popconfirm>
              </span>
            ),
        ]}
        author={
          <Text style={{ color: token.colorText }} strong>
            {item.commenter.id === user.id
              ? "You"
              : `${item.commenter.first_name} ${item.commenter.last_name}`}{" "}
            . <small>{dayjs(item.createdAt).fromNow()}</small>
          </Text>
        }
        avatar={
          <Avatar
            src="https://xsgames.co/randomusers/avatar.php?g=pixel"
            alt="Han Solo"
          />
        }
        // content={<Paragraph>{item.comment}</Paragraph>}
        content={
          <div style={{ whiteSpace: "normal" }}>
            {parts.map((part, index) => {
              if (part.startsWith("@")) {
                let userId = part.split("@")[1];
                let newMention = "";

                let userData = "";

                if (!isNaN(userId)) {
                  let member = team?.find(
                    (c) => parseInt(c.user_id) === parseInt(userId)
                  );

                  if (member) {
                    let { value, user, project_role } = member;
                    userData = `${user.first_name} ${user.last_name} | ${project_role.name}`;
                    newMention = `@${value}`;
                  } else {
                    newMention = `@${userId}`;
                  }
                } else {
                  newMention = `@${userId}`;
                }
                if (!isNaN(userId) && isNaN(newMention.split("@")[1])) {
                  return (
                    <Tooltip key={index} title={userData}>
                      <Typography.Text
                        style={{ cursor: "pointer" }}
                        strong
                        mark
                      >
                        {newMention}
                      </Typography.Text>
                    </Tooltip>
                  );
                } else {
                  return (
                    <Typography.Text key={index}>{newMention}</Typography.Text>
                  );
                }
              } else {
                return <span key={index}>{part}</span>;
              }
            })}
          </div>
        }
      >
        {children}
      </Comment>
    </>
  );
}

export default React.memo(CommentComponent);
