import { Button, Col, Form, Input, Progress, Row, Typography } from "antd";
import React from "react";
import PasswordForm from "./PasswordForm";
import { useSelector } from "react-redux";
const { Text, Title } = Typography;
const TOTAL_SPAN = 24;
function UserClientForm({ form }) {
  const isUpdatingUser = useSelector((state) => state.client.isUpdatingUser);

  return (
    <>
      <div>
        <Title level={5} className="mb-2" strong>
          Security
        </Title>
        <Row gutter={[10, 0]}>
          <Form.Item hidden name="id">
            <Input />
          </Form.Item>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: TOTAL_SPAN / 2 }}
            lg={{ span: TOTAL_SPAN / 2 }}
            xl={{ span: TOTAL_SPAN / 2 }}
            xxl={{ span: TOTAL_SPAN / 2 }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Email name is required",
                },
                {
                  type: "email",
                  message: "Email not valid",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          {!isUpdatingUser && (
            <Col
              xs={{ span: TOTAL_SPAN }}
              sm={{ span: TOTAL_SPAN }}
              md={{ span: TOTAL_SPAN / 2 }}
              lg={{ span: TOTAL_SPAN / 2 }}
              xl={{ span: TOTAL_SPAN / 2 }}
              xxl={{ span: TOTAL_SPAN / 2 }}
            >
              <PasswordForm />
            </Col>
          )}
        </Row>
      </div>
      <div>
        <Title level={5} className="mb-2" strong>
          Personal Info
        </Title>
        <Row gutter={[10, 0]}>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: TOTAL_SPAN / 2 }}
            lg={{ span: TOTAL_SPAN / 2 }}
            xl={{ span: TOTAL_SPAN / 2 }}
            xxl={{ span: TOTAL_SPAN / 2 }}
          >
            <Form.Item
              label="First name"
              name="first_name"
              rules={[
                {
                  required: true,
                  message: "First name is required!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: TOTAL_SPAN / 2 }}
            lg={{ span: TOTAL_SPAN / 2 }}
            xl={{ span: TOTAL_SPAN / 2 }}
            xxl={{ span: TOTAL_SPAN / 2 }}
          >
            <Form.Item
              label="Last name"
              name="last_name"
              rules={[
                {
                  required: true,
                  message: "Last name is required",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: TOTAL_SPAN / 2 }}
            lg={{ span: TOTAL_SPAN / 2 }}
            xl={{ span: TOTAL_SPAN / 2 }}
            xxl={{ span: TOTAL_SPAN / 2 }}
          >
            <Form.Item
              label="Phone Number"
              name="phone_number"
              // rules={[
              //   {
              //     required: true,
              //     message: "Phone Number is required",
              //   },
              // ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </div>
      <div>
        <Title level={5} className="mb-2" strong>
          Address
        </Title>
        <Row gutter={[10, 0]}>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: TOTAL_SPAN / 2 }}
            lg={{ span: TOTAL_SPAN / 2 }}
            xl={{ span: TOTAL_SPAN / 2 }}
            xxl={{ span: TOTAL_SPAN / 2 }}
          >
            <Form.Item label="Street" name="street_nr">
              <Input />
            </Form.Item>
          </Col>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: TOTAL_SPAN / 2 }}
            lg={{ span: TOTAL_SPAN / 2 }}
            xl={{ span: TOTAL_SPAN / 2 }}
            xxl={{ span: TOTAL_SPAN / 2 }}
          >
            <Form.Item label="Zip" name="zip_code">
              <Input />
            </Form.Item>
          </Col>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: TOTAL_SPAN / 2 }}
            lg={{ span: TOTAL_SPAN / 2 }}
            xl={{ span: TOTAL_SPAN / 2 }}
            xxl={{ span: TOTAL_SPAN / 2 }}
          >
            <Form.Item label="City" name="city">
              <Input />
            </Form.Item>
          </Col>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: TOTAL_SPAN / 2 }}
            lg={{ span: TOTAL_SPAN / 2 }}
            xl={{ span: TOTAL_SPAN / 2 }}
            xxl={{ span: TOTAL_SPAN / 2 }}
          >
            <Form.Item label="Country" name="country">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button className="w-100" type="primary" htmlType="submit">
            {isUpdatingUser ? "Update" : "Submit"}
          </Button>
        </Form.Item>
      </div>
    </>
  );
}

export default UserClientForm;
