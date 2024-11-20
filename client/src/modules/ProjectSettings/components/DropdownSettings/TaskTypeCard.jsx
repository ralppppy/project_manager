import React, { Suspense, useState } from "react";
import {
  Card,
  Divider,
  Space,
  Typography,
  Tag,
  Button,
  Input,
  List,
} from "antd";
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
        <List
          header={<div>Header</div>}
          footer={<div>Footer</div>}
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text mark>[ITEM]</Typography.Text> {item.title}
            </List.Item>
          )}
        />
      </Card>
    </>
  );
};

export default React.memo(TaskTypeCard);
