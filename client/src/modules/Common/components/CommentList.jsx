import { Avatar, List, Mentions, theme, Typography } from "antd";
import { Comment } from "@ant-design/compatible";

import React, { useEffect, useRef } from "react";
import {
  UploadOutlined,
  PaperClipOutlined,
  SendOutlined,
} from "@ant-design/icons";
import "./styles.css";

const { Text, Paragraph } = Typography;

function CommentList({ style }) {
  const commentRef = useRef();
  const dataList = Array.from({
    length: 5,
  }).map((_, i) => ({
    href: "https://ant.design",
    title: `Ralp Yosores ${i}`,
    avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`,
    description:
      "Ant Design, a design language for background applications, is refined by Ant UED Team.",
    content:
      "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
  }));

  const ExampleComment = ({ children }) => (
    <Comment
      style={{
        backgroundColor: token.colorBgContainer,
        color: token.colorText,
        padding: token.padding,
        borderRadius: token.borderRadius,
      }}
      actions={[
        <span key="comment-nested-reply-to">
          <Text style={{ fontSize: 10 }}>Reply</Text>
        </span>,
        <span key="comment-nested-reply-to">
          <UploadOutlined style={{ color: token.colorText }} />{" "}
          <Text style={{ fontSize: 10 }}>Upload File</Text>
        </span>,
        <span key="comment-nested-reply-to">
          <PaperClipOutlined style={{ color: token.colorText }} />{" "}
          <Text style={{ fontSize: 10 }}>Files (1)</Text>
        </span>,
      ]}
      author={
        <Text style={{ color: token.colorText }} strong>
          Han Solo . <small>3 minutes ago</small>
        </Text>
      }
      avatar={
        <Avatar
          src="https://xsgames.co/randomusers/avatar.php?g=pixel"
          alt="Han Solo"
        />
      }
      content={
        <Paragraph>
          We supply a series of design principles, practical patterns and high
          quality design resources (Sketch and Axure).
        </Paragraph>
      }
    >
      {children}
    </Comment>
  );

  useEffect(() => {
    commentRef.current?.scrollIntoView();
  }, []);

  const onChange = (value) => {
    console.log("Change:", value);
  };

  const onSelect = (option) => {
    console.log("select", option);
  };

  const { token } = theme.useToken();

  return (
    <>
      <div className="mb-3" style={style}>
        <List
          itemLayout="vertical"
          size="small"
          dataSource={dataList}
          renderItem={(item, index) => (
            <List.Item className="pl-0">
              <ExampleComment>
                <ExampleComment />
                <ExampleComment />
              </ExampleComment>
            </List.Item>
          )}
        />
        <div ref={commentRef} />
      </div>

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
          onChange={onChange}
          onSelect={onSelect}
          suffix={<SendOutlined />}
          placeholder="Enter you comment"
          options={[
            {
              value: "1",
              label: "afc163",
            },
            {
              value: "zombieJ",
              label: "zombieJ",
            },
            {
              value: "yesmeck",
              label: "yesmeck",
            },
          ]}
        />

        <SendOutlined className="m-1" style={{ fontSize: 15 }} />
      </div>
    </>
  );
}

export default CommentList;
