import { List, message } from "antd";

import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useQuery, useQueryClient } from "react-query";
import { TaskListController } from "../controllers";
import relativeTime from "dayjs/plugin/relativeTime";
import CommentInput from "./CommentInput";
import CommentComponent from "./CommentComponent";
dayjs.extend(relativeTime);

function CommentList({ style, form, isInternal }) {
  const updateData = useSelector((state) => state.taskList.updateData);
  const commentingStatus = useSelector(
    (state) => state.taskList.commentingStatus
  );
  const user = useSelector((state) => state.login.user);
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const { handleGetComments } = TaskListController({
    queryClient,
  });
  const mentionRef = useRef();

  // const [commentValue, setCommentValue] = useState("");

  const commentRef = useRef();

  const TASK_COMMENT_KEY = [
    "task_comment",
    user.organization_id,
    updateData.id,
    isInternal,
  ];
  const { data, isLoading, isFetching } = useQuery({
    queryKey: TASK_COMMENT_KEY,
    queryFn: () =>
      handleGetComments({
        task_id: updateData.id,
        organization_id: user.organization_id,
        isInternal,
      }),

    enabled: !!updateData.id,
    keepPreviousData: true,
    staleTime: Infinity,
  });
  const [currentRef, setCurrentRef] = useState(null);

  useEffect(() => {
    commentRef.current?.scrollIntoView();
  }, [commentRef.current]);

  useEffect(() => {
    if (currentRef) {
      currentRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      commentRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [commentingStatus]);

  return (
    <>
      {contextHolder}
      <div className="mb-3" style={style}>
        <List
          itemLayout="vertical"
          size="small"
          loading={isFetching || isLoading}
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item key={item.id} className="pl-0">
              <CommentComponent
                form={form}
                mentionRef={mentionRef}
                setCurrentRef={setCurrentRef}
                item={item}
                isInternal={isInternal}
                updateData={updateData}
                messageApi={messageApi}
              >
                {item.replies?.map((commentChild) => (
                  <CommentComponent
                    key={commentChild.id}
                    form={form}
                    setCurrentRef={setCurrentRef}
                    mentionRef={mentionRef}
                    className="comment-style"
                    item={commentChild}
                    commentParent={item}
                    isInternal={isInternal}
                    updateData={updateData}
                    messageApi={messageApi}
                    isReply={true}
                  />
                ))}
                {/*
                <CommentComponent /> */}
              </CommentComponent>
            </List.Item>
          )}
        />
        <div ref={commentRef} />
      </div>

      <CommentInput
        commentRef={commentRef}
        mentionRef={mentionRef}
        form={form}
        isInternal={isInternal}
      />
    </>
  );
}

export default React.memo(CommentList);
