import React, { Suspense } from "react";
import { Card, Divider, Space, Typography, Tag, Button, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

const UserRolesCard = () => {
  return (
    <>
      <Card>
        <Space size={0} className="w-100" direction="vertical">
          <Text style={{ fontSize: 14 }} strong>
            {"User Roles"}
          </Text>

          <Text strong type="secondary">
            {""}
          </Text>
        </Space>

        <Divider />

        {/* <ModuleSearchInput /> */}
        <Space size={10} className="w-100" direction="vertical">
          <Space className="w-100" size={0} direction="vertical"></Space>
          <Space className="w-100" size={0} direction="vertical">
            <Tag color="processing" className="w-100">
              Role 1
            </Tag>
          </Space>
          <Space className="w-100" size={0} direction="vertical">
            <Tag color="volcano" className="w-100">
              Role 2
            </Tag>
          </Space>
          <Space className="w-100" size={0} direction="vertical">
            <Tag color="green" className="w-100">
              Role 3
            </Tag>
          </Space>
          <Space className="w-100" size={0} direction="vertical">
            <Input />
          </Space>
          <Divider />
          <Space className="w-100" size={0} direction="vertical">
            <Button
              disabled
              onClick={() => {
                handleModalOpen(true);
              }}
              icon={<PlusOutlined />}
              className="w-100"
              type="primary"
            >
              Save Changes
            </Button>
          </Space>
        </Space>
      </Card>
      <Suspense fallback={<></>}>{/* <ModuleModalForm /> */}</Suspense>
    </>
  );
};

export default React.memo(UserRolesCard);
