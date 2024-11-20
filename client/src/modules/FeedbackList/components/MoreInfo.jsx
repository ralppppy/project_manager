import { Space, Typography } from "antd";
import React from "react";

const { Title, Text } = Typography;

function MoreInfo() {
  return (
    <div className="d-flex align-items-center w-100 mt-3">
      <Space size={0} className="w-100" direction="vertical" align="center">
        <Title level={3}>365:48 </Title>

        <Text level={5}>Total Time Estimate </Text>
      </Space>
    </div>
  );
}

export default MoreInfo;
