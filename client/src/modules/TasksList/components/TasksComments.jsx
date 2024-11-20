import React from "react";
import { Tabs, theme } from "antd";
import { CommentList } from ".";
import { useSelector } from "react-redux";

function TasksComments({ form }) {
  const { token } = theme.useToken();
  const isEmployee = useSelector((state) => state.login.user.is_employee);

  let items = [
    {
      label: `General Comments`,
      key: "1",
      children: (
        <div
          style={{
            // height: 600 - 52,
            height: 400,
          }}
        >
          <CommentList
            isInternal={false}
            form={form}
            style={{
              height: "100%",
              overflow: "auto",
            }}
          />
        </div>
      ),
    },
    {
      label: `Internal Comments`,
      key: "2",
      children: (
        <div
          style={{
            height: 400,
            // height: 600 - 52,
          }}
        >
          <CommentList
            isInternal={true}
            form={form}
            style={{
              height: "100%",
              overflow: "auto",
            }}
          />
        </div>
      ),
    },
  ].filter((c) => {
    if (!isEmployee) {
      if (c.key === "1") {
        return true;
      } else {
        return false;
      }
    }
    return true;
  });
  return (
    <div className="h-100">
      <Tabs
        defaultActiveKey={isEmployee ? "2" : "1"}
        centered
        style={{ backgroundColor: token.colorBgContainer }}
        items={items}
      />
    </div>
  );
}

export default TasksComments;
