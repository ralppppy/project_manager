import { Button, Form, Input, Col, Row, Space, Typography, Tag } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ProjectController from "../controllers/ProjectController";
import { useQueryClient } from "react-query";

const TOTAL_SPAN = 24;

const { Text } = Typography;

function AddVersions({ form, QUERY_KEY }) {
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const queryClient = useQueryClient();

  const isUpdate = useSelector((state) => state.project.isUpdate);
  const versions = Form.useWatch("versions", form);

  const { handleAddVersion, handleRemoveVersion } = ProjectController({
    form,
    queryClient,
    QUERY_KEY,
  });

  return (
    <>
      <Col
        xs={{ span: TOTAL_SPAN }}
        sm={{ span: TOTAL_SPAN }}
        md={{ span: 20 }}
        lg={{ span: 20 }}
        xl={{ span: 20 }}
        xxl={{ span: 20 }}
      >
        <Form.Item label="Version Name" name="version_name">
          <Input />
        </Form.Item>
      </Col>
      <Col
        xs={{ span: TOTAL_SPAN }}
        sm={{ span: TOTAL_SPAN }}
        md={{ span: 4 }}
        lg={{ span: 4 }}
        xl={{ span: 4 }}
        xxl={{ span: 4 }}
        className="d-flex align-items-center mt-4"
      >
        <Form.Item>
          <Button onClick={() => handleAddVersion(organization_id)} type="link">
            Add
          </Button>
        </Form.Item>
      </Col>
      <Col
        xs={{ span: TOTAL_SPAN }}
        sm={{ span: TOTAL_SPAN }}
        md={{ span: TOTAL_SPAN }}
        lg={{ span: TOTAL_SPAN }}
        xl={{ span: TOTAL_SPAN }}
        xxl={{ span: TOTAL_SPAN }}
        className="mb-3"
      >
        <Form.Item
          extra="You must provide atleast 1 version name"
          name="versions"
          rules={[
            {
              required: true,
              message: "Please add atleast 1 version!",
            },
          ]}
        >
          <Space align="center" size="small">
            <div>
              <Text>Versions: </Text>
            </div>
            <div>
              {versions?.map((version, index) => (
                <Tag
                  key={version.id ? version.id : `${index}-new`}
                  onClose={() =>
                    handleRemoveVersion(organization_id, version, isUpdate)
                  }
                  closable
                >
                  {version.name}
                </Tag>
              ))}
            </div>
          </Space>
        </Form.Item>
      </Col>
    </>
  );
}

export default React.memo(AddVersions);
