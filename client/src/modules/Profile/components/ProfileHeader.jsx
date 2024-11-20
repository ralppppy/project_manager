import { Avatar, Card, Space, Typography } from "antd";
import React from "react";
import { useSelector } from "react-redux";

const { Text } = Typography;

function ProfileHeader() {
  const user = useSelector((state) => state.login.user);

  return (
    <Card>
      <div className="d-flex align-items-center justify-content-between">
        <Space size={20}>
          <Avatar
            shape="square"
            size={74}
            src="http://notarealhuman.com/face"
          />

          <Space size={0} direction="vertical">
            <Text style={{ fontSize: 15 }} strong level={3}>
              {user.first_name} {user.last_name}
            </Text>
            <Text type="secondary" level={5}>
              Web developer
            </Text>
          </Space>
        </Space>

        {/* <div>werwer </div> */}
      </div>
    </Card>
  );
}

export default React.memo(ProfileHeader);
