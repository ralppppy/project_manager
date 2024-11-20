import { Divider, Space, Typography } from "antd";
import React from "react";

const { Text, Title } = Typography;

const TasksPopoverTitle = ({ projectName, clientName }) => {
  return (
    <>
      <Title level={5} className="m-0">
        {projectName}
      </Title>
      <Text className="mt-2 mb-0" style={{ opacity: 0.5 }}>
        {clientName}
      </Text>
      <Divider className="m-1" />
    </>
  );
};

export default TasksPopoverTitle;
