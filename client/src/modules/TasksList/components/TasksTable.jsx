import {
  Typography,
  Table,
  Tag,
  Space,
  Button,
  Tooltip,
  theme,
  Popconfirm,
  Modal,
  List,
  message,
} from "antd";
import React, { Suspense, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { TaskListController } from "../controllers";
import {
  FlagTwoTone,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Developers } from "../../Common/components";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { TaskTableFilters } from ".";
import { Routes } from "../../../common";

dayjs.extend(duration);

const { Text, Title } = Typography;

function TaskTable({ isDashboard = false, isFeedback = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modal, contextHolderModal] = Modal.useModal();
  const [messageApi, contextHolder] = message.useMessage();

  const {
    handleGetTasks,
    onTableChange,
    handleModalOpen,
    generateTasksQueryKey,
    handleDeleteTask,
    handleNavigateToTimeLog,
    handleDeleteTaskCommentAndAttachment,
  } = TaskListController({ navigate, dispatch });

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const currentUserId = useSelector((state) => state.login.user.id);
  const isEmployee = useSelector((state) => state.login.user.is_employee);
  const { token } = theme.useToken();

  const tableQuery = useLoaderData();
  const pageSize = parseInt(tableQuery.pagination.pageSize);
  const page = parseInt(tableQuery.pagination.page);

  const filters = useSelector((state) => state.taskList.filters);
  const taskTitleSearch = useSelector(
    (state) => state.taskList.taskTitleSearch
  );

  const isUnassigned = useSelector((state) => state.taskList.pointFilter);
  const queryClient = useQueryClient();

  const selectedFilter = useSelector((state) => state.common.selectedFilter);
  const {
    module_id: modId,
    project_id: projId,
    client_id: clientId,
  } = useParams();

  const { client_id, project_id, module_id } = generateTasksQueryKey(
    { isDashboard, isFeedback },
    selectedFilter,
    { modId, projId, clientId }
  );
  const QUERY_KEY = [
    "tasks",
    organization_id,
    client_id,
    project_id,
    module_id,
    { pageSize, page },
    filters,
    taskTitleSearch,
    isFeedback,
    isDashboard,
    currentUserId,
    isUnassigned,
  ];
  const UNASSIGNED_QUERY_KEY = [
    "unassigned_tasks",
    organization_id,
    client_id,
    project_id,
    module_id,
    { pageSize, page },
    filters,
    taskTitleSearch,
    isFeedback,
    isUnassigned,
  ];

  const {
    data: assigned,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () =>
      handleGetTasks({
        organization_id,
        module_id: module_id,
        client_id: client_id,
        project_id: project_id,
        paginate: { pageSize, page },
        filters,
        taskTitleSearch,
        isFeedback,
        isDashboard,
        currentUserId,
        isUnassigned: 0,
      }),
    enabled: !!organization_id && !!filters,
    keepPreviousData: true,
    staleTime: Infinity,
  });

  const { data: unassigned } = useQuery({
    queryKey: UNASSIGNED_QUERY_KEY,
    queryFn: () =>
      handleGetTasks({
        organization_id,
        module_id: module_id,
        client_id: client_id,
        project_id: project_id,
        paginate: { pageSize, page },
        filters,
        taskTitleSearch,
        isFeedback,
        isUnassigned: 1,
      }),
    enabled: !!organization_id && !!filters,
    keepPreviousData: true,
    staleTime: Infinity,
  });

  const { mutate: deleteTaksCommentAndAttachementMutate } = useMutation({
    mutationFn: handleDeleteTaskCommentAndAttachment,
    onSuccess: ([response, error]) => {
      if (error) {
        queryClient.invalidateQueries(QUERY_KEY);
        messageApi.open({
          type: "error",
          content: "Something went wrong",
        });
      } else {
        queryClient.invalidateQueries(QUERY_KEY);
        messageApi.open({
          type: "success",
          content: "Succesfully deleted task!",
        });
      }
    },
  });

  const { mutate: deleteTaskMutate } = useMutation({
    mutationFn: handleDeleteTask,
    onSuccess: ([response, error]) => {
      if (error) {
        let { message } = error.response.data;
        let FORBIDDEN = 403;
        let CONFLICT = 409;

        let responseMessage = {
          [FORBIDDEN]: () => {
            modal.warning({
              title: "Cannot delete this task",
              content: (
                <Space direction="vertical">
                  <Text strong>{message.message}</Text>
                  <List
                    size="small"
                    bordered
                    header={<Text>Plotted date</Text>}
                    dataSource={message.datePlotted}
                    renderItem={(item) => (
                      <List.Item
                        actions={[
                          <Tooltip title="Got to timelog">
                            <Button
                              onClick={() =>
                                handleNavigateToTimeLog(Routes.timeLogs, item)
                              }
                              icon={<CalendarOutlined />}
                              size="small"
                            />
                          </Tooltip>,
                          //   Got to date
                          // </Button>,
                        ]}
                      >
                        {item.date_plotted}
                      </List.Item>
                    )}
                  />
                </Space>
              ),
            });
          },
          [CONFLICT]: () => {
            modal.confirm({
              title: "Warning - this is irreversable",
              closable: true,
              okText: "Delete",
              onOk: () => {
                deleteTaksCommentAndAttachementMutate({
                  ...message.extraData,
                  deleteToken: message.deleteToken,
                });
              },
              content: (
                <Space direction="vertical">
                  <Text strong>{message.message}</Text>
                </Space>
              ),
            });
          },
        };

        responseMessage[error.response.status]();
      } else {
        queryClient.invalidateQueries(QUERY_KEY);
        messageApi.open({
          type: "success",
          content: "Succesfully deleted task!",
        });
      }
    },
  });

  const columns = useMemo(
    () =>
      [
        {
          title: "ID",
          dataIndex: "key",
          key: "key",
          width: "5%",

          onCell: (record) => {
            let style = record.is_feedback
              ? {
                  style: {
                    borderLeft: `2px solid ${token.red5}`,
                  },
                }
              : {};
            return {
              ...style,
            };
          },

          shouldCellUpdate: (record, prev) =>
            JSON.stringify(record) !== JSON.stringify(prev),
        },
        {
          title: "Clients",
          dataIndex: "client",
          key: "client",
          width: "10%",
          ellipsis: true,
          shouldCellUpdate: (record, prev) =>
            JSON.stringify(record) !== JSON.stringify(prev),
          render: (client) => {
            return <Text>{client.name}</Text>;
          },
        },
        {
          title: "Project Name",
          dataIndex: "project",
          width: "10%",
          key: "project",
          ellipsis: true,
          shouldCellUpdate: (record, prev) =>
            JSON.stringify(record) !== JSON.stringify(prev),
          render: (project) => {
            return <Text>{project.name}</Text>;
          },
        },
        {
          title: "Task title",
          dataIndex: "task_title",
          key: "task_title",
          width: "20%",
          ellipsis: true,
          shouldCellUpdate: (record, prev) =>
            JSON.stringify(record) !== JSON.stringify(prev),
        },
        {
          title: "Assigned To",
          dataIndex: "team",
          width: "10%",
          key: "team",
          align: "center",
          shouldCellUpdate: (record, prev) =>
            JSON.stringify(record) !== JSON.stringify(prev),
          render: (team) => {
            return <Developers users={team} size="medium" />;
          },
        },
        {
          title: "Status",
          dataIndex: "task_status",
          width: "5%",
          key: "task_status",

          shouldCellUpdate: (record, prev) =>
            JSON.stringify(record) !== JSON.stringify(prev),
          render: (task_status) => {
            return <Tag color={task_status.color}>{task_status.name}</Tag>;
          },
        },
        {
          title: "Type",
          dataIndex: "task_type",
          width: "10%",
          key: "task_type",
          shouldCellUpdate: (record, prev) =>
            JSON.stringify(record) !== JSON.stringify(prev),
          render: (task_type) => {
            return (
              <Button
                style={{
                  borderColor: task_type.color,
                  color: task_type.color,
                  cursor: "default",
                }}
                disabled
                type="dashed"
                size="small"
              >
                {task_type.name}
              </Button>
            );
          },
        },
        {
          title: "Priority",
          dataIndex: "task_priority",
          width: "5%",
          align: "center",
          key: "task_priority",
          shouldCellUpdate: (record, prev) =>
            JSON.stringify(record) !== JSON.stringify(prev),
          render: (task_priority) => {
            return (
              <Tooltip title={task_priority.name}>
                <Button
                  shape="circle"
                  type="dashed"
                  style={{
                    borderColor: task_priority.color,
                  }}
                  icon={<FlagTwoTone twoToneColor={task_priority.color} />}
                />
              </Tooltip>
            );
          },
        },

        {
          title: "Deadline",
          dataIndex: "deadline",
          key: "deadline",
          width: "10%",
          align: "center",
          shouldCellUpdate: (record, prev) =>
            JSON.stringify(record) !== JSON.stringify(prev),
          render: (deadline) => {
            return (
              <Text>
                {deadline ? dayjs(deadline).format("DD MMMM, YYYY") : "N/A"}
              </Text>
            );
          },
        },

        {
          title: "Task approval",
          dataIndex: "action",

          key: "action",
          render: (is_approved) => {
            return (
              <Tag color={is_approved ? "green" : "red"}>
                {is_approved ? "Yes" : "Pending"}
              </Tag>
            );
          },
        },
        {
          title: "Action",
          hidden: isEmployee && isFeedback,
          dataIndex: "action",
          key: "action",
          sorter: true,
          width: 100,
          shouldCellUpdate: (record, prev) =>
            JSON.stringify(record) !== JSON.stringify(prev),
          render: (_, task) => {
            let disableButton = true;

            if (isEmployee) {
              disableButton =
                parseInt(task.creator.id) !== parseInt(currentUserId);
            } else {
              disableButton = !task.is_feedback;
            }

            return (
              <Space>
                <Button
                  disabled={!isEmployee && !task.is_feedback}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModalOpen(true, true, task, false);
                  }}
                  size="small"
                  type="default"
                  icon={<EditOutlined />}
                />

                <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task?"
                  onConfirm={() => deleteTaskMutate({ organization_id, task })}
                  // onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                  placement="topLeft"
                  onPopupClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Button
                    disabled={disableButton}
                    // disabled={
                    //   !isEmployee &&
                    //   !task.is_feedback &&
                    //   parseInt(task.creator.id) !== parseInt(currentUserId)
                    // }
                    size="small"
                    type="primary"
                    danger
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              </Space>
            );
          },
        },
      ].filter((c) => !c.hidden),
    []
  );

  return (
    <Suspense fallback={<></>}>
      {contextHolderModal}
      {contextHolder}
      <Table
        loading={isFetching}
        scroll={{ x: 1300 }}
        dataSource={isUnassigned ? unassigned?.data : assigned?.data}
        columns={columns}
        title={() => {
          return (
            <>
              <TaskTableFilters />
            </>
          );
        }}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              event.stopPropagation();
              handleModalOpen(true, true, record, true);
            },

            style: {
              cursor: "pointer",
            },
          };
        }}
        // size="small"
        onChange={onTableChange}
        pagination={{
          position: "bottom",
          align: "end",
          current: page,
          pageSize: pageSize,
          page: page,
          total: isUnassigned ? unassigned?.totalData : assigned?.totalData,
          pageSizeOptions: ["10", "20", "50"],
          showSizeChanger: true,
        }}
      />
    </Suspense>
  );
}

export default TaskTable;
