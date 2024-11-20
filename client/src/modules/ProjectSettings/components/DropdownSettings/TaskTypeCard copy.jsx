import React, { Suspense, useState } from "react";
import { Card, Divider, Space, Typography, Tag, Button, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import ToggleEditableTag from "./ToggleEditableTag";
const { Text } = Typography;

const TaskTypeCard = () => {
  const [enableSave, setEnableSave] = useState(false);
  const [data, setData] = useState([
    { id: 1, title: "Type 1", color: "geekblue" },
    { id: 2, title: "Type 2", color: "volcano" },
    { id: 3, title: "Type 3", color: "green" },
  ]);
  const defaultColorData = [
    { id: 1, color: "magenta" },
    { id: 2, color: "red" },
    { id: 3, color: "volcano" },
    { id: 4, color: "orange" },
    { id: 5, color: "gold" },
    { id: 6, color: "lime" },
    { id: 7, color: "green" },
    { id: 8, color: "cyan" },
    { id: 9, color: "blue" },
    { id: 10, color: "geekblue" },
    { id: 11, color: "purple" },
  ];
  return (
    <>
      <Card>
        <Space size={0} className="w-100" direction="vertical">
          <Text style={{ fontSize: 14 }} strong>
            {"Task Types"}
          </Text>
          <Text strong type="secondary">
            {""}
          </Text>
        </Space>
        <Divider />
        <Space size={10} className="w-100" direction="vertical">
          {data.map((t) => (
            <Space className="w-100" size={0} direction="vertical">
              <ToggleEditableTag
                key={t.id}
                title={t.title}
                color={t.color}
                setEnableSave={setEnableSave}
                defaultColorData={defaultColorData}
              />
            </Space>
          ))}

          <Space className="w-100" size={0} direction="vertical">
            <Input
              autoFocus
              onPressEnter={() => {
                const randomIndex = Math.floor(
                  Math.random() * defaultColorData.length
                );
                const randomId = Math.floor(Math.random() * 100);
                setData((prev) => [
                  ...prev,
                  {
                    id: randomId,
                    title: `Type ${randomId}`,
                    color: defaultColorData[randomIndex]["color"],
                  },
                ]);
              }}
            />
          </Space>
          <Divider />
          <Space className="w-100" size={0} direction="vertical">
            <Button
              disabled={!enableSave}
              onClick={() => {
                setEnableSave(false);
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

export default React.memo(TaskTypeCard);
