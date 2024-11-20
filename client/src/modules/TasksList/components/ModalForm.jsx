import {
  Button,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import React from "react";
// // import { Editor } from "@tinymce/tinymce-react";

import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { TaskListController } from "../controllers";
import {
  AddTaskBreadCrumb,
  ConnectedToDropdown,
  DeadlineForm,
  HoursWorked,
  TaskAssingnee,
  TaskInstructionForm,
  TaskStatusDropdown,
  TaskTitleForm,
  TasksPriorityDropdown,
  TasksTypeDropdown,
  TimeEstimate,
} from ".";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "react-query";
import { setErrors } from "../models/TasksListModel";
import { useLoaderData, useParams } from "react-router-dom";

const { Text } = Typography;
const TOTAL_SPAN = 24;

function ModalForm({ form, isDashboard, messageApi, isFeedback }) {
  const dispatch = useDispatch();

  const { generateTasksQueryKey } = TaskListController({});

  const queryClient = useQueryClient();
  const isUpdate = useSelector((state) => state.taskList.isUpdate);
  const updateData = useSelector((state) => state.taskList.updateData);
  const isView = useSelector((state) => state.taskList.isView);

  const user = useSelector((state) => state.login.user);

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );
  const taskTitleSearch = useSelector(
    (state) => state.taskList.taskTitleSearch
  );
  const tableQuery = useLoaderData();

  const pageSize = parseInt(tableQuery.pagination.pageSize);
  const page = parseInt(tableQuery.pagination.page);
  const filters = useSelector((state) => state.taskList.filters);

  const selectedFilter = useSelector((state) => state.common.selectedFilter);
  const {
    module_id: modId,
    project_id: projId,
    client_id: clientId,
  } = useParams();

  const {
    client_id: clientIdTask,
    project_id: projectIdTask,
    module_id: moduleIdTask,
  } = generateTasksQueryKey({ isDashboard, isFeedback }, selectedFilter, {
    modId,
    projId,
    clientId,
  });
  const QUERY_KEY_TASKS = [
    "tasks",
    organization_id,
    clientIdTask,
    projectIdTask,
    moduleIdTask,
    { pageSize, page },
    filters,
    taskTitleSearch,
    isFeedback,
  ];

  const {
    handleUpdateTask,
    handleCreateOrUpdateTask,
    handleSuccessCreateTask,
  } = TaskListController({
    dispatch,
    user,
    queryClient,
    QUERY_KEY_TASKS,
    organization_id,
    messageApi,
  });

  const { mutate } = useMutation({
    mutationFn: handleCreateOrUpdateTask,
    onSuccess: handleSuccessCreateTask,
  });

  const { mutate: updateTask } = useMutation({
    mutationFn: handleUpdateTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["task_list_popover"]);
    },
  });

  let gridType = "default";

  if (isUpdate) {
    gridType = "update";
  } else if (isFeedback) {
    gridType = "feedback";
  }

  let definitionGrid = {
    feedback: {
      xs: 1,
      sm: 1,
      md: 2,
      lg: 2,
      xl: 2,
      xxl: 2,
    },
    update: {
      xs: 1,
      sm: 1,
      md: 4,
      lg: 6,
      xl: 6,
      xxl: 6,
    },
    default: {
      xs: 1,
      sm: 1,
      md: 3,
      lg: 4,
      xl: 4,
      xxl: 4,
    },
  };

  return (
    <>
      <Form
        className="mt-3"
        layout="vertical"
        form={form}
        name="basic-"
        onFinishFailed={(errors) => {
          let errorsCollumn = {
            client_id: "Client",
            project_id: "Project",
            module_id: "Module",
          };

          errors.errorFields.forEach((c) => {
            if (c.name[0] && errorsCollumn[c.name[0]]) {
              dispatch(setErrors({ [c.name[0]]: true }));
            }
          });
        }}
        onFinish={(values) => {
          values = { ...values, is_feedback: !!isFeedback };
          mutate({
            values,
            additionalData: {
              organization_id: user.organization_id,
            },
            isUpdate,
            task_id: updateData.id,
          });
        }}
        // onFieldsChange={(value) => {
        //   console.log(value, "valuevaluevalue");
        // }}
        preserve={false}
        autoComplete="off"
      >
        <Form.Item
          hidden
          rules={[
            {
              message: "this is custom",
              validator: (_, value) => {
                if (value && !isNaN(value)) {
                  return Promise.resolve();
                } else {
                  return Promise.reject("Some message here");
                }
              },
            },
          ]}
          name="project_id"
        >
          <Input />
        </Form.Item>

        {!isFeedback && (
          <Form.Item
            hidden
            rules={[
              {
                message: "this is custom",
                validator: (_, value) => {
                  if (value && !isNaN(value)) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject("Some message here");
                  }
                },
              },
            ]}
            name="module_id"
          >
            <Input />
          </Form.Item>
        )}

        <Form.Item
          hidden
          rules={[
            {
              message: "this is custom",
              validator: (_, value) => {
                if (value && !isNaN(value)) {
                  return Promise.resolve();
                } else {
                  return Promise.reject("Some message here");
                }
              },
            },
          ]}
          name="client_id"
        >
          <Input />
        </Form.Item>

        <Row className="mt-3" gutter={[10, 20]}>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: TOTAL_SPAN }}
            lg={{ span: TOTAL_SPAN }}
            xl={{ span: TOTAL_SPAN }}
            xxl={{ span: TOTAL_SPAN }}
          >
            <Row gutter={[10, 10]}>
              <Col
                xs={{ span: TOTAL_SPAN }}
                sm={{ span: TOTAL_SPAN }}
                md={{ span: TOTAL_SPAN }}
                lg={{ span: TOTAL_SPAN / 2 }}
                xl={{ span: TOTAL_SPAN / 2 }}
                xxl={{ span: TOTAL_SPAN / 2 }}
                style={{ overflow: "auto" }}
              >
                <Space
                  className="mt-3"
                  size={"small"}
                  style={{ overflow: "auto" }}
                  split={<Divider className="mt-2" type="vertical" />}
                  align="start"
                >
                  <TaskStatusDropdown updateTask={updateTask} form={form} />

                  <TasksTypeDropdown form={form} updateTask={updateTask} />
                  <TasksPriorityDropdown form={form} updateTask={updateTask} />
                  <ConnectedToDropdown form={form} />

                  <TaskAssingnee
                    isDashboard={isDashboard}
                    isFeedback={isFeedback}
                    form={form}
                  />
                </Space>
              </Col>
              <Col
                xs={{ span: TOTAL_SPAN }}
                sm={{ span: TOTAL_SPAN }}
                md={{ span: TOTAL_SPAN }}
                lg={{ span: TOTAL_SPAN / 2 }}
                xl={{ span: TOTAL_SPAN / 2 }}
                xxl={{ span: TOTAL_SPAN / 2 }}
              >
                <Descriptions
                  column={definitionGrid[gridType]}
                  size="small"
                  layout="vertical"
                >
                  {isUpdate && (
                    <Descriptions.Item label="Hours worked">
                      <HoursWorked form={form} updateTask={updateTask} />
                    </Descriptions.Item>
                  )}

                  {(!isFeedback || isUpdate) && (
                    <Descriptions.Item label="Time estimate">
                      <TimeEstimate form={form} updateTask={updateTask} />
                    </Descriptions.Item>
                  )}

                  <Descriptions.Item label="Deadline">
                    <DeadlineForm form={form} updateTask={updateTask} />
                  </Descriptions.Item>
                  {isUpdate && (
                    <Descriptions.Item label="Created by">
                      {`${updateData?.creator?.first_name} ${updateData?.creator?.last_name}`}
                    </Descriptions.Item>
                  )}

                  <Descriptions.Item label="Date created">
                    {dayjs.utc(updateData?.createdAt).format("DD-MM-YYYY")}
                  </Descriptions.Item>

                  {isUpdate && (
                    <Descriptions.Item label="Task approval">
                      <Tag color="red">Pending</Tag>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Col>
            </Row>
          </Col>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: TOTAL_SPAN }}
            lg={{ span: TOTAL_SPAN }}
            xl={{ span: TOTAL_SPAN }}
            xxl={{ span: TOTAL_SPAN }}
          >
            <TaskTitleForm updateTask={updateTask} form={form} />
          </Col>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: TOTAL_SPAN }}
            lg={{ span: TOTAL_SPAN }}
            xl={{ span: TOTAL_SPAN }}
            xxl={{ span: TOTAL_SPAN }}
          >
            <TaskInstructionForm updateTask={updateTask} form={form} />
          </Col>
        </Row>

        {!isView && (
          <Button
            icon={<PlusOutlined />}
            className="w-100"
            type="primary"
            htmlType="submit"
          >
            Submit task
          </Button>
        )}
      </Form>
    </>
  );
}

export default ModalForm;
