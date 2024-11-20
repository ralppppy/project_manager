import { Checkbox, Form, Space, Typography } from "antd";
import React from "react";

const { Text } = Typography;

function SingleFilterInput({
  label,
  form,
  data,
  checkData,
  setCheckData,
  name,
}) {
  return (
    <Space size={0} direction="vertical">
      <Text>{label}</Text>
      <Space align="center">
        <Form.Item>
          <Checkbox
            onChange={(e) => {
              if (e.target.checked) {
                form.setFieldValue(
                  name,
                  data?.map((c) => c.id)
                );
              } else {
                form.setFieldValue(name, []);
              }
              setCheckData((prev) => ({
                ...prev,
                checked: e.target.checked,
                indeterminate: false,
              }));
            }}
            indeterminate={checkData.indeterminate}
            checked={checkData.checked}
          >
            All
          </Checkbox>
        </Form.Item>
        <Form.Item name={name}>
          <Checkbox.Group options={data?.map((c) => ({ ...c, value: c.id }))} />
        </Form.Item>
      </Space>
    </Space>
  );
}

export default React.memo(SingleFilterInput);
