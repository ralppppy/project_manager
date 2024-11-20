import React from "react";
import { Card, Typography, Table, Badge } from "antd";
import dayjs from "dayjs";
import { DashboardController } from "../controller";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";

const { Text } = Typography;
const UnassignedProjectTable = () => {
  const { handleGetUnassignedProjects } = DashboardController();
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const columns = [
    {
      title: "Clients",
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
      title: "Project Leader",
      dataIndex: "developers",
      key: "developers",
      render: (text, row) => {
        return <Text>{row.team[0]?.user?.name}</Text>;
      },
    },

    {
      title: "Date Created",
      dataIndex: "date_updated",
      key: "date_updated",
      render: (text, row) => {
        return <Text>{dayjs(row.date_updated).format("YYYY-MM-DD")}</Text>;
      },
    },
  ];

  const QUERY_KEY_UNASSIGNED_PROJECTS = [
    "unassigned_projects",
    organization_id,
  ];

  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEY_UNASSIGNED_PROJECTS,
    queryFn: () => handleGetUnassignedProjects(organization_id),
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
            <Text>Unassigned Projects</Text>
            <Badge className="ml-4" count={data?.length} />
          </>
        }
      >
        <Table
          scroll={{ x: 500 }}
          dataSource={data}
          columns={columns}
          pagination={{
            position: ["bottomRight"],
            pageSize: 5,
          }}
          rowKey="id"
        />
      </Card>
    </>
  );
};

export default UnassignedProjectTable;
