import { Col, Collapse, Row, Space, Tag, Typography } from "antd";
import React from "react";
import AssignedTableRow from "./AssignedTableRow";

const { Text } = Typography;
const TOTAL_SPAN = 24;
const AssignedTable = ({ user }) => {
  return (
    <div>
      <Collapse
        key={user.key}
        className="mb-2"
        items={[
          {
            label: (
              <div className="d-flex align-items-center justify-content-between">
                <Text className="w-20" strong>
                  {user.title}
                </Text>
                <Text strong>
                  <Space>
                    Total Tasks: <Tag>{user.total_tasks}</Tag>
                  </Space>
                </Text>
              </div>
            ),
            children: <AssignedTableRow userId={user.id} />,
            key: `${user.id}_${user.title}`,
          },
        ]}
      />
    </div>
  );
};

export default AssignedTable;
