import React, { Suspense, useEffect } from "react";
import {
  Card,
  Divider,
  Progress,
  Space,
  Typography,
  Tag,
  Button,
  Empty,
  message,
  theme,
} from "antd";
import { SyncOutlined, PlusOutlined, CheckOutlined } from "@ant-design/icons";
import { Developers } from "../../Common/components";
import { TasksListModalForm } from ".";
import { useParams } from "react-router-dom";
import { ModuleListController } from "../../ModuleList/controllers";
import { useQuery, useQueryClient } from "react-query";
import dayjs from "dayjs";
import { TaskListController } from "../controllers";
import { useDispatch, useSelector } from "react-redux";

import { secondsToHours } from "@common_root/TimeHelper";

const { Text, Paragraph } = Typography;

const ProjectList = () => {
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );
  const queryClient = useQueryClient();

  const { token } = theme.useToken();

  const dispatch = useDispatch();

  const {
    handleGetSinlgeModuleData,
    handleGetCompletionPercent,
    handleGetTaskHours,
  } = ModuleListController({
    dispatch,
  });

  const { handleModalOpen, handleTaskListFilterChange } = TaskListController({
    dispatch,
  });

  const { module_id, project_id, client_id } = useParams();

  const MODULE_KEY = ["single_module", client_id, project_id, module_id];
  const MODULE_COMPLETION_PERCENT_KEY = [
    "task_completion_percent",
    client_id,
    project_id,
    module_id,
  ];
  const MODULE_TAKS_HOURS_KEY = [
    "task_hours",
    client_id,
    project_id,
    module_id,
  ];

  const QUERY_KEY_CLIENTS_FILTER = ["filter_client_project", true];

  const queyryState = queryClient.getQueryState(QUERY_KEY_CLIENTS_FILTER);

  const { data, isFetching } = useQuery({
    queryKey: MODULE_KEY,
    queryFn: () =>
      handleGetSinlgeModuleData({
        client_id: client_id,
        project_id: project_id,
        module_id,
        organization_id,
      }),

    enabled: !!module_id,
    keepPreviousData: true,
    staleTime: Infinity,
  });
  const { data: completionPercent } = useQuery({
    queryKey: MODULE_COMPLETION_PERCENT_KEY,
    queryFn: () =>
      handleGetCompletionPercent({
        client_id: client_id,
        project_id: project_id,
        module_id,
        organization_id,
      }),

    enabled: !!module_id,
    keepPreviousData: true,
    staleTime: Infinity,
  });

  const { data: tasksHours } = useQuery({
    queryKey: MODULE_TAKS_HOURS_KEY,
    queryFn: () =>
      handleGetTaskHours({
        client_id: client_id,
        project_id: project_id,
        module_id,
        organization_id,
      }),

    select: (data) => {
      return Array.isArray(data.data)
        ? data.data[0]
        : { total_hours_worked: 0, total_time_estimate: 0 };
    },

    enabled: !!module_id,
    keepPreviousData: true,
    staleTime: Infinity,
  });

  useEffect(() => {
    handleTaskListFilterChange({
      filterState: queyryState?.data,
      client_id,
      project_id,
      module_id,
    });
  }, [queyryState?.data, project_id, module_id, client_id, data]);

  if (!data && !isFetching) {
    return (
      <>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </>
    );
  }

  let percentCompleted = parseInt(
    (completionPercent?.data.start / completionPercent?.data.end) * 100
  );

  let completedHours = parseInt(
    (parseInt(tasksHours?.total_hours_worked) /
      parseInt(tasksHours?.total_time_estimate)) *
      100
  );

  return (
    <>
      <Suspense fallback={<Card loading={true} />}>
        <Card loading={isFetching}>
          <Space size={0} className="w-100" direction="vertical">
            <Text style={{ fontSize: 14 }} strong>
              {data?.name}
            </Text>

            <Text strong type="secondary">
              {data?.project?.name || "All"}
            </Text>
          </Space>
          <Divider />
          <Space size={20} className="w-100" direction="vertical">
            {data?.description && (
              <Space className="w-100" size={0} direction="vertical">
                <Text strong>Description</Text>
                <Paragraph>{data?.description}</Paragraph>
              </Space>
            )}

            <Space className="w-100" size={0} direction="vertical">
              <Text strong>Completed task</Text>
              <Text style={{ fontSize: 11 }} type="secondary">
                <Space align="center">
                  <Text style={{ fontSize: 11 }}>
                    {completionPercent?.data.start} /{" "}
                    {completionPercent?.data.end}
                  </Text>
                </Space>
              </Text>
              <Progress
                percent={percentCompleted}
                status={percentCompleted >= 100 ? "success" : "active"}
              />{" "}
            </Space>
            <Space className="w-100" size={0} direction="vertical">
              <Text strong> Ploted Hours / Total Hours: </Text>
              <Text style={{ fontSize: 11 }} type="secondary">
                <Space align="center">
                  <Text style={{ fontSize: 11 }}>
                    {parseInt(
                      secondsToHours(parseInt(tasksHours?.total_hours_worked))
                    )}{" "}
                    /{" "}
                    {parseInt(
                      secondsToHours(parseInt(tasksHours?.total_time_estimate))
                    )}
                  </Text>
                </Space>
              </Text>
              <Progress
                percent={completedHours}
                status={completedHours >= 100 ? "success" : "active"}
              />{" "}
            </Space>

            <Space className="w-100" size={0} direction="vertical">
              <Text strong>Developers </Text>
              <Developers
                isLoading={isFetching}
                users={data?.team}
                size="medium"
                maxCount={10}
              />
            </Space>
            <Space className="w-100" size={0} direction="vertical">
              <Text strong>Date started </Text>
              <Text style={{ fontSize: 11 }}>
                {dayjs(data?.createdAt).format("DD MMMM, YYYY")}
              </Text>
            </Space>
            <Space className="w-100" size={0} direction="vertical">
              <Text strong>Status</Text>
              <Tag
                icon={data?.active ? <SyncOutlined spin /> : <CheckOutlined />}
                color={data?.active ? "processing" : token.green6}
              >
                {data?.active ? "On Going" : "Completed"}
              </Tag>
            </Space>
            <Divider />
            <Space className="w-100" size={0} direction="vertical">
              <Button
                onClick={() => {
                  handleModalOpen(true);
                }}
                icon={<PlusOutlined />}
                className="w-100"
                type="primary"
              >
                Create New Task
              </Button>
            </Space>
          </Space>
        </Card>
      </Suspense>
      <Suspense fallback={<></>}>
        <TasksListModalForm />{" "}
      </Suspense>
    </>
  );
};

export default React.memo(ProjectList);
