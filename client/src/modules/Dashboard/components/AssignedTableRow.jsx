import { Button, Space, Table, Typography } from "antd";
import React, { useState } from "react";
import { DashboardController } from "../controller";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";

import { secondsToHHMM } from "../../../common/TimeHelper";
import TasksPopover from "./TasksPopover";

const { Text } = Typography;

function AssignedTableRow({ userId }) {
  const { handleGetUserProjects } = DashboardController();

  const [openPopover, setOpenPopover] = useState(null);

  const handlePopoverClick = (row) => {
    setOpenPopover(row);
  };

  const closePopover = () => {
    setOpenPopover(null);
  };

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const QUERY_KEY_USER_PROJECTS = ["user_projects", organization_id, userId];

  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEY_USER_PROJECTS,
    queryFn: () => handleGetUserProjects(organization_id, userId),
    refetchOnWindowFocus: false,
    enabled: !!organization_id || !!userId,
    staleTime: 10,
    keepPreviousData: true,
  });

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
      title: "Project",
      dataIndex: "proj_name",
      key: "proj_name",
      render: (text, row) => {
        return <Text>{row.name}</Text>;
      },
    },
    {
      title: "Remaining Hours",
      dataIndex: "remaining_hours",
      key: "remaining_hours",
      render: (text, row) => {
        let hours_worked_individual =
          row?.tasks[0]?.timelog_data[0]?.hours_worked_individual || 0;
        let remaining_hours = row.remaining_hours || 0;
        return (
          <Text>
            {secondsToHHMM(remaining_hours - hours_worked_individual)}
          </Text>
        );
      },
    },
    {
      title: "Hours Worked(Individual)",
      dataIndex: "hours_worked_individual",
      key: "hours_worked_individual",
      render: (text, row) => {
        return (
          <Text>
            {secondsToHHMM(
              row?.tasks[0]?.timelog_data[0]?.hours_worked_individual || 0
            )}
          </Text>
        );
      },
    },
    {
      title: "Hours Worked(Project)",
      dataIndex: "hours_worked_project",
      key: "hours_worked_project",
      render: (text, row) => {
        return (
          <Text>
            {secondsToHHMM(
              row?.tasks[0]?.timelog_data_project[0]?.hours_worked_project || 0
            )}
          </Text>
        );
      },
    },
    {
      title: "Open Tasks",
      dataIndex: "open_tasks",
      key: "open_tasks",
      render: (text, row) => {
        return (
          <>
            <Button type="link" onClick={() => handlePopoverClick(row)}>
              {row.open_tasks}
              {row === openPopover ? (
                <TasksPopover
                  project={row}
                  userId={userId}
                  onClose={closePopover}
                />
              ) : null}
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <Table
      bordered={false}
      scroll={{ x: 1300 }}
      loading={isFetching}
      dataSource={data}
      columns={columns}
      pagination={false}
      rowKey="id"
    />
  );
}

export default AssignedTableRow;
