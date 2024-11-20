import React, { Suspense, useEffect } from "react";
import { Card, Divider, Progress, Space, Typography, Tag, Button } from "antd";
import { SyncOutlined, PlusOutlined } from "@ant-design/icons";
import { Developers } from "../../Common/components";
import { useDispatch, useSelector } from "react-redux";
import { ModuleListController } from "../controllers";
import { ModuleModalForm } from ".";
import { useQuery, useQueryClient } from "react-query";
import dayjs from "dayjs";
import ModuleSearchInput from "./ModuleSearchInput";
import { secondsToHours } from "@common_root/TimeHelper";
import { useParams } from "react-router-dom";

const { Text } = Typography;

const ProjectList = () => {
  const dispatch = useDispatch();

  const {
    handleModalOpen,
    handleGetProjectSummaryData,
    handleGetProjectCompletionPercent,
    handleGetTaskHours,
    handleTaskListFilterChange,
  } = ModuleListController({
    dispatch,
  });

  const queryClient = useQueryClient();

  const parentFilterName = useSelector(
    (state) => state.common.parentFilterName
  );

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const childFilterName = useSelector((state) => state.common.childFilterName);

  const { module_id, project_id, client_id } = useParams();

  const PROJECT_SUMMARY_KEY = ["project_summary", client_id, project_id];

  const PROJECT_MODULE_TAKS_HOURS_KEY = [
    "project_task_hours",
    client_id,
    project_id,
    "All",
  ];

  const MODULE_COMPLETION_PERCENT_KEY = [
    "project_completion_percent",
    client_id,
    project_id,
    "All",
  ];

  const QUERY_KEY_CLIENTS_FILTER = ["filter_client_project", false];

  const queyryState = queryClient.getQueryState(QUERY_KEY_CLIENTS_FILTER);

  const { data, isFetching } = useQuery({
    queryKey: PROJECT_SUMMARY_KEY,
    queryFn: () =>
      handleGetProjectSummaryData({
        client_id: client_id,
        project_id: project_id,
        organization_id,
      }),
    enabled: !!client_id,
    keepPreviousData: true,
    staleTime: Infinity,
  });

  const { data: completionPercent } = useQuery({
    queryKey: MODULE_COMPLETION_PERCENT_KEY,
    queryFn: () =>
      handleGetProjectCompletionPercent({
        client_id: client_id,
        project_id: project_id,
        organization_id,
      }),

    enabled: !!client_id,
    keepPreviousData: true,
    staleTime: Infinity,
  });

  const { data: tasksHours } = useQuery({
    queryKey: PROJECT_MODULE_TAKS_HOURS_KEY,
    queryFn: () =>
      handleGetTaskHours({
        client_id: client_id,
        project_id: project_id,
        module_id: "All",
        organization_id,
      }),

    enabled: !!client_id,
    keepPreviousData: true,
    staleTime: Infinity,
  });

  let percentCompleted = parseInt(
    (completionPercent?.completed / completionPercent?.total) * 100
  );

  let completedHours = parseInt(
    (parseInt(tasksHours?.data.total_hours_worked) /
      parseInt(tasksHours?.data.total_time_estimate)) *
      100
  );

  useEffect(() => {
    handleTaskListFilterChange({
      filterState: queyryState?.data,
      client_id,
      project_id,
      module_id: "All",
    });
  }, [queyryState?.data, project_id, module_id, client_id, data]);

  return (
    <>
      <Card loading={isFetching}>
        <Space size={0} className="w-100" direction="vertical">
          <Text style={{ fontSize: 14 }} strong>
            {parentFilterName}{" "}
          </Text>

          <Text strong type="secondary">
            {childFilterName}{" "}
          </Text>
        </Space>

        <Divider />

        <ModuleSearchInput />
        <Space size={10} className="w-100" direction="vertical">
          <Space className="w-100" size={0} direction="vertical">
            <Text strong>Module completed</Text>
            <Text style={{ fontSize: 11 }} type="secondary">
              <Space align="center">
                <Text style={{ fontSize: 11 }}>
                  {completionPercent?.completed || 0} /{" "}
                  {completionPercent?.total || 0}
                </Text>
              </Space>
            </Text>
            <Progress
              percent={percentCompleted}
              status={percentCompleted === 100 ? "success" : "active"}
            />{" "}
          </Space>

          <Space className="w-100" size={0} direction="vertical">
            <Text strong> Ploted Hours / Total Hours: </Text>
            <Text style={{ fontSize: 11 }} type="secondary">
              <Space align="center">
                <Text style={{ fontSize: 11 }}>
                  {parseInt(
                    secondsToHours(
                      parseInt(tasksHours?.data.total_hours_worked)
                    )
                  )}{" "}
                  /{" "}
                  {parseInt(
                    secondsToHours(
                      parseInt(tasksHours?.data.total_time_estimate)
                    )
                  )}
                </Text>
              </Space>
            </Text>
            <Progress
              percent={completedHours}
              status={completedHours === 100 ? "success" : "active"}
            />{" "}
          </Space>
          <Space className="w-100" size={0} direction="vertical">
            <Text strong>Developers </Text>
            <Developers
              isLoading={isFetching}
              users={data?.teams_users}
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
            <Tag icon={<SyncOutlined spin />} color="processing">
              On Going
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
              Create New Module
            </Button>
          </Space>
        </Space>
      </Card>
      <Suspense fallback={<></>}>
        <ModuleModalForm />
      </Suspense>
    </>
  );
};

export default React.memo(ProjectList);
