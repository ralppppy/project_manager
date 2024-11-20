import React from "react";
import { Form, Input, Typography, Card, Grid, Radio } from "antd";
import { useSelector } from "react-redux";

const { useBreakpoint } = Grid;

const { Title, Text } = Typography;

const onFinish = (values) => {
  console.log("Success:", values);
};

function LanguageAndRegion() {
  const cardHeight = useSelector((state) => state.profile.cardHeight);

  return (
    <Card bodyStyle={{ height: cardHeight, overflow: "auto" }}>
      <div className="notification-container">
        <div className="notification-title">
          <Text>Language and Region</Text>
        </div>
      </div>
      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        size="small"
        layout="vertical"
        // onFinish={handleLogin}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Language"
          name="language"
          className="w-30"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Timezone"
          name="timezone"
          className="w-30"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Time format"
          name="timeFormat"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Radio.Group>
            <Radio value={1}>24 hour</Radio>
            <Radio value={2}>12 hour</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Date format"
          name="timeFormat"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Radio.Group>
            <Radio value={1}>mm/dd/yyyy</Radio>
            <Radio value={2}>dd/mm/yyyy</Radio>
            <Radio value={3}>yyyy/mm/dd</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default React.memo(LanguageAndRegion);
