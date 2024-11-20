import React from "react";
import { Typography } from "antd";

const { Title } = Typography;
function DashboardHeader() {
  return (
    <div>
      <Title level={3}>Dashboard</Title>
    </div>
  );
}

export default DashboardHeader;
