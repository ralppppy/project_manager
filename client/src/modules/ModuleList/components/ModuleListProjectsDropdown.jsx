import { Form, Col, Select } from "antd";
import React from "react";

import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { ModuleListController } from "@modules/ModuleList/controllers";

const TOTAL_SPAN = 24;

const { Option } = Select;

function ModuleListProjectsDropdown({ form }) {
  const loggedInUser = useSelector((state) => state.login.user);
  const { handleGetProjects } = ModuleListController({ loggedInUser });

  const selectedClientId = useSelector(
    (state) => state.module.selectedClientId
  );
  const isUpdate = useSelector((state) => state.module.isUpdate);
  let QUERY_KEY_PROJECTS = [
    "projects_dropdown",
    loggedInUser.organization_id,
    selectedClientId,
  ];
  let clientId = Form.useWatch("client_id", form);
  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEY_PROJECTS,
    queryFn: () => handleGetProjects(loggedInUser, selectedClientId),
    enabled: !!clientId,
    staleTime: Infinity,
  });

  return (
    <Col
      xs={{ span: TOTAL_SPAN }}
      sm={{ span: TOTAL_SPAN }}
      md={{ span: 12 }}
      lg={{ span: 12 }}
      xl={{ span: 12 }}
      xxl={{ span: 12 }}
    >
      <Form.Item
        label="Project"
        name="project_id"
        rules={[
          {
            required: true,
            message: "Project is required!",
          },
        ]}
      >
        <Select showSearch allowClear disabled={isUpdate}>
          {data?.map((project) => (
            <Option key={project.id} value={project.id}>
              {project.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
  );
}

export default React.memo(ModuleListProjectsDropdown);
