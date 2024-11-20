import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Progress,
  Row,
  Space,
  Typography,
  message,
} from "antd";
import React, { useState } from "react";
import { SetPasswordController } from "../../Guest/controller";
import { useSelector } from "react-redux";

const TOTAL_SPAN = 24;

const { Title, Paragraph, Text } = Typography;
function Password() {
  const [strength, setStrength] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const currentUser = useSelector((state) => state.login.user);

  const {
    handlePasswordChange,
    handleGetProgressColor,
    handleGetProgressSteps,
    handleValidatePassword,
    handleUpdatePassword,
    handleForgotPasswordEmail,
  } = SetPasswordController({
    setStrength,
    messageApi,
    form,
    setUpdatingPassword,
    setResetPassword,
  });
  const strengthLabels = [
    "Very Weak",
    "Weak",
    "Moderate",
    "Strong",
    "Very Strong",
  ];

  return (
    <>
      {contextHolder}
      <Title level={3}>Password</Title>
      <Row gutter={[10, 10]}>
        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: 8 }}
          lg={{ span: 8 }}
          xl={{ span: 8 }}
          xxl={{ span: 8 }}
        >
          <Card>
            <Title level={4}>
              Change your password or recover your current one
            </Title>
            <Paragraph>
              After a successful password update, you will be redirected to the
              login page where you can log in with your new password.
            </Paragraph>
          </Card>
        </Col>
        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: 16 }}
          lg={{ span: 16 }}
          xl={{ span: 16 }}
          xxl={{ span: 16 }}
        >
          {" "}
          <Card>
            {/* <Paragraph strong>
              Change your password or recover your current one
            </Paragraph> */}

            <Form
              initialValues={{
                remember: true,
              }}
              form={form}
              layout="vertical"
              onFinish={handleUpdatePassword}
              // onFinishFailed={onFinishFailed}
              onValuesChange={(values) => {
                if (values.hasOwnProperty("password")) {
                  handlePasswordChange(values.password);
                }
              }}
              autoComplete="off"
              size="large"
            >
              <Form.Item
                label="Current password"
                name="currentPassword"
                extra="You must provide your current password in order to change it."
                rules={[
                  {
                    required: true,
                    message: "Please input your current password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                  {
                    validator: handleValidatePassword,
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>
              {strength !== null && (
                <div>
                  <Progress
                    percent={handleGetProgressSteps(strength)}
                    status={handleGetProgressColor(strength)}
                    showInfo={false}
                  />
                  <Text strong>
                    Password Strength: {strengthLabels[strength]}
                  </Text>
                </div>
              )}
              <Form.Item
                label="Confirm Password"
                name="confirm"
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The new password that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    loading={updatingPassword}
                    type="primary"
                    htmlType="submit"
                  >
                    Update password
                  </Button>
                  <Button
                    loading={resetPassword}
                    onClick={() => handleForgotPasswordEmail(currentUser.email)}
                    type="link"
                  >
                    I forgot my password
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Password;
