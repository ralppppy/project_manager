import React, { useEffect } from "react";
import { Card, Typography, Table, Badge } from "antd";
import { DashboardController } from "../controller";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { secondsToHHMM } from "../../../common/TimeHelper";

const { Text } = Typography;
const UnassignedTaskTable = () => {
  const { handleGetUnassignedTasks } = DashboardController();
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const columns = [
    {
      title: "Client",
      dataIndex: "clientname",
      key: "clientname",
      render: (text, row) => {
        return <Text>{row.client.name}</Text>;
      },
    },
    {
      title: "Project Name",
      dataIndex: "proj_name",
      key: "proj_name",
      render: (text, row) => {
        return <Text>{row.name}</Text>;
      },
    },
    {
      title: "Estimated Hours",
      dataIndex: "estimated_hours",
      key: "estimated_hours",
      render: (text, row) => {
        return <Text>{secondsToHHMM(row.estimated_hours || 0)}</Text>;
      },
    },
    {
      title: "Open Tasks",
      dataIndex: "open_tasks",
      key: "open_tasks",
      render: (text, row) => {
        return <Text>{row.open_tasks}</Text>;
      },
    },
  ];

  const QUERY_KEY_UNASSIGNED_TASKS = ["unassigned_tasks", organization_id];

  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEY_UNASSIGNED_TASKS,
    queryFn: () => handleGetUnassignedTasks(organization_id),
    select: (data) => {
      let total = 0;
      let items = data?.map((c) => {
        total += c.open_tasks;
        return {
          ...c,
        };
      });
      items.total = total;
      return items;
    },
    refetchOnWindowFocus: false,
    enabled: !!organization_id,
    staleTime: Infinity,
    keepPreviousData: true,
  });

  return (
    <>
      <Card
        className="h-100"
        title={
          <>
            <Text>Unassigned Tasks</Text>
            <Badge className="ml-4" count={data?.total} />
          </>
        }
      >
        <Table
          scroll={{ x: 500 }}
          dataSource={data}
          columns={columns}
          pagination={{ position: ["bottomRight"], pageSize: 5 }}
          rowKey="id"
        />
      </Card>
    </>
  );
};

export default UnassignedTaskTable;
