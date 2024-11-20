import { Card, List, Typography, theme } from "antd";
import React from "react";
import { Link, useResolvedPath } from "react-router-dom";
import { DashboardController } from "../../Dashboard/controller";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";

const { useToken } = theme;

const { Text } = Typography;

function StatusList() {
  const router = useResolvedPath();

  const { token } = useToken();

  const pathName = router.pathname;

  const { handleGetTasksStatusWithCount } = DashboardController({});
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const TASK_STATUS_KEY = ["tasks_status_card_key", organization_id];
  const { data, isLoading, isFetching } = useQuery({
    queryKey: TASK_STATUS_KEY,
    queryFn: () =>
      handleGetTasksStatusWithCount({
        organization_id,
      }),

    onSuccess: ({ data }) => {
      let all = {
        id: -1,
        name: "All",
        color: "green",
        sort: 0,
        tasksCount: 20,
      };

      let totalTaskCount = data.reduce(
        (current, next) => current + next.tasksCount,
        0
      );

      all = { ...all, tasksCount: totalTaskCount };
      data.unshift(all);

      return data;
    },

    enabled: !!organization_id,
    keepPreviousData: true,
    staleTime: 10,
  });

  return (
    <>
      <List
        loading={isFetching}
        itemLayout="horizontal"
        dataSource={data?.data}
        grid={{
          gutter: [10],
          column: 1,
          xs: 2,
          sm: 3,
          md: 1,
          lg: 1,
          xl: 1,
          xxl: 1,
        }}
        renderItem={(item, index) => (
          <List.Item>
            <Link to={`/${pathName.split("/")[1]}/${item.path}`}>
              <Card
                style={
                  pathName.includes(item.path)
                    ? {
                        backgroundColor: token.colorPrimary,
                        color: token.colorBgBase,
                      }
                    : {}
                }
                hoverable
                className="mb-2"
              >
                <div className="d-flex justify-content-between">
                  <Text>{item.name}</Text>
                  <Text>{item.tasksCount}</Text>
                </div>
              </Card>
            </Link>
          </List.Item>
        )}
      />
    </>
  );
}

export default StatusList;
