import React, { useState } from "react";
import { Button, Form, Input, Typography, Grid, Progress, message } from "antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SetPasswordController } from "../controller";
import { useQuery } from "react-query";
import { Routes } from "../../../common";

const { Title, Text } = Typography;

function SetPasswordForm() {
  const [searchParams] = useSearchParams();

  const [strength, setStrength] = useState(null);

  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const token = searchParams.get("tkn");
  const navigate = useNavigate();

  const {
    handleVerifyToken,
    handlePasswordChange,
    handleGetProgressColor,
    handleGetProgressSteps,
    handleValidatePassword,
    handleSetPassword,
  } = SetPasswordController({
    setStrength,
    token,
    navigate,
    setIsSettingPassword,
    messageApi,
  });

  const VERIFY_TOKEN_KEY = ["verify_token", token];
  const { data, isFetching } = useQuery({
    queryKey: VERIFY_TOKEN_KEY,
    queryFn: () => handleVerifyToken(token),
    enabled: !!token,
    staleTime: 10,
  });

  if (isFetching) return <></>;

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
      {!data ? (
        <div className="text-center">
          <Title level={5}>
            The page has been expired or have an invalid token
          </Title>

          <Link to={Routes.login}>
            <Button className="w-100" type="link">
              Go back to login
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {" "}
          <div className="d-flex align-items-center justify-content-center mb-3">
            <div className="mt-3">
              <Title level={2}>Please set your password</Title>
            </div>
          </div>
          <Form
            name="basic"
            initialValues={{
              remember: true,
            }}
            onValuesChange={(values) => {
              if (values.hasOwnProperty("password")) {
                handlePasswordChange(values.password);
              }
            }}
            size="large"
            layout="vertical"
            onFinish={handleSetPassword}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              name="password"
              label="Password"
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
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
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
              {/* <Link to={"/"}> */}
              <Button
                loading={isSettingPassword}
                className="w-100"
                type="primary"
                htmlType="submit"
              >
                Confirm Password
              </Button>
              {/* </Link> */}
            </Form.Item>
          </Form>
        </>
      )}
    </>
  );
}

export default SetPasswordForm;
