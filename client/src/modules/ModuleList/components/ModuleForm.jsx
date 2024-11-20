import { Button, Col, Form, Input, Row, Select } from "antd";
import React, { useEffect } from "react";
import ModuleListClientsDropdown from "./ModuleListClientsDropdown";
import ModuleListProjectsDropdown from "./ModuleListProjectsDropdown";
import ModuleListAddTeam from "./ModuleListAddTeam";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedClientId,
  setSelectedProjectId,
} from "../models/ModuleListModel";

const TOTAL_SPAN = 24;

const { TextArea } = Input;

function ModuleForm({ form }) {
  const dispatch = useDispatch();
  const updateModuleState = useSelector(
    (state) => state.module.updateModuleState
  );
  const selectedFilter = useSelector((state) => state.common.selectedFilter);
  const isUpdate = useSelector((state) => state.module.isUpdate);
  useEffect(() => {
    if (isUpdate) {
      let { id, client_id } = updateModuleState.project;
      form.setFieldsValue({
        ...updateModuleState,
        client_id: client_id,
        project_id: id,
      });
    }
  }, []);

  const isFilteredClientAndProjectAll = (selectedFilter) =>
    selectedFilter.clientId > 0 &&
    `${selectedFilter.projectId}`.includes("all");
  const isFilteredClientAndProject = (selectedFilter) =>
    selectedFilter.clientId > 0 && selectedFilter.projectId > 0;

  useEffect(() => {
    // filtered client
    if (isFilteredClientAndProjectAll(selectedFilter)) {
      form.setFieldsValue({
        client_id: selectedFilter.clientId,
      });
    }
    // filtered client and project
    if (isFilteredClientAndProject(selectedFilter)) {
      form.setFieldsValue({
        client_id: selectedFilter.clientId,
        project_id: selectedFilter.projectId,
      });
    }

    dispatch(setSelectedClientId(selectedFilter.clientId));
    dispatch(setSelectedProjectId(selectedFilter.projectId));
  }, [selectedFilter.projectId, selectedFilter.clientId]);

  return (
    <>
      <Row gutter={[10, 0]}>
        <Form.Item hidden name="id">
          <Input />
        </Form.Item>

        <ModuleListClientsDropdown form={form} />
        <ModuleListProjectsDropdown form={form} />
        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: TOTAL_SPAN }}
          lg={{ span: TOTAL_SPAN }}
          xl={{ span: TOTAL_SPAN }}
          xxl={{ span: TOTAL_SPAN }}
        >
          <Form.Item
            label="Module Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Module Name is required!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: TOTAL_SPAN }}
          lg={{ span: TOTAL_SPAN }}
          xl={{ span: TOTAL_SPAN }}
          xxl={{ span: TOTAL_SPAN }}
        >
          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Description is required!",
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Col>

        <ModuleListAddTeam form={form} />
      </Row>

      <Form.Item>
        <Button className="w-100" type="primary" htmlType="submit">
          {isUpdate ? "Update" : "Submit"}
        </Button>
      </Form.Item>
    </>
  );
}

export default ModuleForm;
