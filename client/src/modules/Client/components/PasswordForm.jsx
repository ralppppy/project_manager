import { Button, Col, Form, Input, Progress, Row, Typography } from "antd";
import React from "react";
import { SetPasswordController } from "../../Guest/controller";
import { useSelector } from "react-redux";
const { Text, Title } = Typography;
const TOTAL_SPAN = 24;

function PasswordForm({}) {
  //   const isUpdate = useSelector((state) => state.userManagement.isUpdate);

  const passwordStrength = useSelector(
    (state) => state.client.passwordStrength
  );

  //   useEffect(() => {
  //     if (isUpdate) {
  //       form.setFieldsValue(updateState);
  //     }
  //   }, [isUpdate, updateState, form]);

  const {
    handleValidatePassword,
    handleGetProgressSteps,
    handleGetProgressColor,
  } = SetPasswordController({});

  const strengthLabels = [
    "Very Weak",
    "Weak",
    "Moderate",
    "Strong",
    "Very Strong",
  ];

  return (
    <>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Pasword is required",
          },
          {
            validator: handleValidatePassword,
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      {passwordStrength !== null && (
        <div>
          <Progress
            percent={handleGetProgressSteps(passwordStrength)}
            status={handleGetProgressColor(passwordStrength)}
            showInfo={false}
          />
          <Text strong>
            Password Strength: {strengthLabels[passwordStrength]}
          </Text>
        </div>
      )}
    </>
  );
}

export default React.memo(PasswordForm);
