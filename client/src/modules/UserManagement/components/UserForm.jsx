import { Button, Col, Divider, Form, Input, Row, Typography } from "antd";
import React, { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { DepartmentForm, UserTypeForm } from ".";
const { Text, Title } = Typography;
const TOTAL_SPAN = 24;
function UserForm({ form }) {
  const isUpdate = useSelector((state) => state.userManagement.isUpdate);

  const updateState = useSelector((state) => state.userManagement.updateState);

  useEffect(() => {
    if (isUpdate) {
      form.setFieldsValue(updateState);
    }
  }, [isUpdate, updateState, form]);

  return (
    <>
      <Row gutter={[10, 0]}>
        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: TOTAL_SPAN / 2 }}
          lg={{ span: TOTAL_SPAN / 2 }}
          xl={{ span: TOTAL_SPAN / 2 }}
          xxl={{ span: TOTAL_SPAN / 2 }}
        >
          <Suspense fallback={<></>}>
            <UserTypeForm form={form} />
          </Suspense>
        </Col>
        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: TOTAL_SPAN / 2 }}
          lg={{ span: TOTAL_SPAN / 2 }}
          xl={{ span: TOTAL_SPAN / 2 }}
          xxl={{ span: TOTAL_SPAN / 2 }}
        >
          <Suspense fallback={<></>}>
            <DepartmentForm form={form} />
          </Suspense>
        </Col>
      </Row>
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
            {isUpdate ? "Update" : "Submit"}
          </Button>
        </Form.Item>
      </div>
    </>
  );
}

export default UserForm;
