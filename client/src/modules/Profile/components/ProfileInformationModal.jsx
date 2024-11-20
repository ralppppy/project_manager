import { Button, Col, Form, Input, Modal, Row, Typography } from "antd";
import React, { useEffect } from "react";
import { ProfileController } from "../controllers";
import { useDispatch, useSelector } from "react-redux";

const TOTAL_SPAN = 24;

const { Title } = Typography;

function ProfileInformationModal({ userData }) {
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const profileInfoModal = useSelector(
    (state) => state.profile.profileInfoModal
  );

  const user = useSelector((state) => state.login.user);

  const { handleOpenProfileModalOpen, handleSubmit } = ProfileController({
    dispatch,
  });

  useEffect(() => {
    if (profileInfoModal && userData) {
      form.setFieldsValue({
        ...userData,
      });
    }
  }, [userData, profileInfoModal]);

  return (
    <Modal
      title={"Update Profile Information"}
      open={profileInfoModal}
      footer={null}
      //   className="w-50"
      destroyOnClose={true}
      onOk={() => handleOpenProfileModalOpen(false)}
      onCancel={() => handleOpenProfileModalOpen(false)}
    >
      <Form
        className="mt-3"
        layout="vertical"
        name="basic-"
        onFinish={(values) => {
          handleSubmit({
            values,
            organization_id: user.organization_id,
            prevData: user,
          });
        }}
        form={form}
        // preserve={false}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
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
              <Input disabled />
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
              Update
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}

export default ProfileInformationModal;
