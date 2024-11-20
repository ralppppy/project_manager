import { Card, Typography, Tabs } from "antd";
import React, { Suspense } from "react";
import AssignedTable from "./AssignedTable";
import { useSelector } from "react-redux";
import { DashboardController } from "../controller";
import { useQuery } from "react-query";
const { Text } = Typography;

const AssignedTabs = () => {
  const { handleGetDashboardUsers } = DashboardController();
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const QUERY_KEY_DEPARTMENTS = ["departments_dashboard", organization_id];

  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEY_DEPARTMENTS,
    queryFn: () => handleGetDashboardUsers(organization_id),
    select: (item) => {
      if (item.data) {
        item = item.data;
      }
      let items = item?.map((c) => {
        return {
          ...c,
          label: c.title,
          children: c.children.map((d) => {
            return <AssignedTable key={`${c.key}_${d.id}`} user={d.user} />;
          }),
        };
      });

      return items;
    },
    refetchOnWindowFocus: false,
    enabled: !!organization_id,
    staleTime: Infinity,
    keepPreviousData: true,
  });

  return (
    <Card title={<Text>Assigned Tasks</Text>}>
      <Tabs defaultActiveKey="1" centered items={data} />
    </Card>
  );
};

export default AssignedTabs;
