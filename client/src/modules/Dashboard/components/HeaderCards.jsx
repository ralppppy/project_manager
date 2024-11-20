import { Card, List, Statistic, theme } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { Routes } from "../../../common";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { DashboardController } from "../controller";

const HeaderCards = ({ isFeedback }) => {
  const { handleGetTasksStatusWithCount } = DashboardController({});
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );
  const selectedFilter = useSelector((state) => state.common.selectedFilter);

  const TASK_STATUS_KEY = [
    "tasks_status_card_key",
    organization_id,
    selectedFilter.clientId,
    selectedFilter.projectId,
    selectedFilter.moduleId,
    isFeedback,
  ];
  const { data, isLoading, isFetching } = useQuery({
    queryKey: TASK_STATUS_KEY,
    queryFn: () =>
      handleGetTasksStatusWithCount({
        organization_id,
        selectedFilter,
        isFeedback,
      }),

    enabled: !!organization_id,
    keepPreviousData: true,
    staleTime: Infinity,
  });
  return (
    <>
      <List
        loading={isFetching}
        itemLayout="horizontal"
        dataSource={data?.data}
        grid={{
          gutter: [10, 10],
          column: data?.data?.length,
          xs: 1,
          sm: 2,
          md: data?.data?.length,
          lg: data?.data?.length,
          xl: data?.data?.length,
          xxl: data?.data?.length,
        }}
        renderItem={(item, index) => (
          <List.Item>
            {/* <Link
              to={`${Routes.feedbackList.replaceAll(":status", item.path)}`}
            > */}
            <Card size="small" bordered={false}>
              <Statistic title={item.name} value={item.tasksCount} />
            </Card>
            {/* </Link> */}
          </List.Item>
        )}
      />
    </>
  );
};

export default HeaderCards;
