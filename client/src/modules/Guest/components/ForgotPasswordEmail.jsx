import React, { useState } from "react";
import { Button, Form, Input, Typography, theme } from "antd";
import { SetPasswordController } from "../controller";
import { Link } from "react-router-dom";
import { Routes } from "../../../common";

const { Title, Text } = Typography;

function ForgotPasswordEmail() {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [doneSending, setDoneSending] = useState(false);

  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const { handleSetPasswordEmail } = SetPasswordController({
    setIsSendingEmail,
    setDoneSending,
    form,
  });

  return (
    <>
      {" "}
      <div className="d-flex align-items-center justify-content-center mb-4">
        <div className="mt-3">
          <Title level={2}>Account Recovery - Password Reset</Title>

          <Text>
            For your security and convenience, we offer a streamlined process to
            help you regain access to your account if you've forgotten your
            password. Please follow the steps below to initiate the password
            reset procedure:
          </Text>

          <Title level={4}>Instructions:</Title>
          <ol style={{ color: token.colorText }}>
            <li>
              <Text>
                Enter the email address associated with your account in the
                field below.
              </Text>
            </li>
            <li>
              {" "}
              <Text>Click the "Reset Password" button. </Text>
            </li>
            <li>
              {" "}
              <Text>Check your email inbox for a message from us. </Text>
            </li>
            <li>
              {" "}
              <Text>
                Follow the detailed instructions in the email to securely reset
                your password.{" "}
              </Text>
            </li>
          </ol>

          <Text>
            In case you do not receive the email within a few minutes, we
            recommend checking your spam folder. Should you encounter any
            difficulties or require further assistance, our dedicated support
            team is available to assist you promptly. Please reach out to us at{" "}
            <a href="mailto:support@email.com">support@email.com</a>.
          </Text>
        </div>
      </div>
      {doneSending && (
        <Text strong>
          {" "}
          We've sent an email to your registered email address. Please check
          your inbox for further instructions on resetting your password. If you
          don't receive the email within a few minutes, please check your spam
          folder.
        </Text>
      )}
      <Form
        form={form}
        className="mt-2"
        name="basic"
        initialValues={{
          remember: true,
        }}
        size="large"
        layout="vertical"
        onFinish={handleSetPasswordEmail}
        autoComplete="off"
      >
        <Form.Item
          //   label="Email"
          size="large"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>
        <Form.Item>
          {/* <Link to={"/"}> */}
          <Button
            loading={isSendingEmail}
            className="w-100"
            type="primary"
            htmlType="submit"
          >
            Reset Password
          </Button>
          {/* </Link> */}
        </Form.Item>
        <Form.Item>
          {/* <Link to={"/"}> */}
          <Link to={Routes.login}>
            <Button className="w-100" type="link">
              Go back to login
            </Button>
          </Link>
          {/* </Link> */}
        </Form.Item>
      </Form>
    </>
  );
}

export default ForgotPasswordEmail;
