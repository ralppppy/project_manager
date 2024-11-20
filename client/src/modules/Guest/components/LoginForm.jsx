import React from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  theme,
  Typography,
  Space,
  Image,
  Grid,
} from "antd";
import { Link } from "react-router-dom";
import logo from "../assets/img/logo.png";
import LoginController from "../controller/LoginController";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Routes } from "../../../common";
const { useBreakpoint } = Grid;

const { Title } = Typography;

const onFinish = (values) => {
  console.log("Success:", values);
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
function LoginForm() {
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const { handleLogin } = LoginController({ navigate, dispatch });
  const screens = useBreakpoint();

  const { token } = theme.useToken();

  return (
    <>
      {" "}
      <div className="d-flex align-items-center justify-content-center mb-3">
        <div style={{ width: screens.lg ? "40%" : "50%" }}>
          <Image src={logo} preview={false} width={"100%"} />
        </div>

        {/* <div className="mt-3">
          <Title style={{ color: token.colorPrimary, marginLeft: -13 }}>
            xactplace
          </Title>
        </div> */}
      </div>
      <Form
        className="w-100"
        name="basic"
        initialValues={{
          remember: true,
        }}
        size="large"
        layout="vertical"
        onFinish={handleLogin}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
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
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          {/* <Link to={"/"}> */}
          <Button className="w-100" type="primary" htmlType="submit">
            LOGIN
          </Button>
          {/* </Link> */}
        </Form.Item>

        <Form.Item>
          <div className="d-flex align-items-center justify-content-between">
            <Link to={"google.com"}> Don't have an account yet?</Link>
            <Link to={Routes.accountRecovery}>Forgot Password?</Link>
          </div>
        </Form.Item>
      </Form>
    </>
    //   </div>
    // </div>
  );
}

export default LoginForm;
