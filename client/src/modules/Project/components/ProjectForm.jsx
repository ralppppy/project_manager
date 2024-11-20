import { Button, Col, Form, Input, Row } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { AddTeam, AddVersions, ClientsDropdown } from ".";

const TOTAL_SPAN = 24;

function ProjectForm({ form, QUERY_KEY }) {
  const isUpdate = useSelector((state) => state.project.isUpdate);
  const updateState = useSelector((state) => state.project.updateState);

  useEffect(() => {
    if (isUpdate) {
      form.setFieldsValue(updateState);
    }
  }, [isUpdate, updateState]);

  return (
    <>
      <Row gutter={[10, 0]}>
        <Form.Item hidden name="id">
          <Input />
        </Form.Item>
        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: 6 }}
          lg={{ span: 6 }}
          xl={{ span: 6 }}
          xxl={{ span: 6 }}
        >
          <Form.Item
            label="Project ID"
            name="project_id_text"
            rules={[
              {
                required: true,
                message: "ID is required!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: 18 }}
          lg={{ span: 18 }}
          xl={{ span: 18 }}
          xxl={{ span: 18 }}
        >
          <Form.Item
            label="Project name"
            name="name"
            rules={[
              {
                required: true,
                message: "Project name is required",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>

        <ClientsDropdown />
        <AddTeam form={form} QUERY_KEY={QUERY_KEY} />
        <AddVersions form={form} QUERY_KEY={QUERY_KEY} />
      </Row>

      <Form.Item>
        <Button className="w-100" type="primary" htmlType="submit">
          {isUpdate ? "Update" : "Submit"}
        </Button>
      </Form.Item>
    </>
  );
}

export default ProjectForm;
