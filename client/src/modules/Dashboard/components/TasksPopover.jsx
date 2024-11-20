import React from "react";
import { Button, Popover, Spin, Typography } from "antd";
import TasksPopoverContent from "./TasksPopoverContent";
import TasksPopoverTitle from "./TasksPopoverTitle";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { DashboardController } from "../controller";

const { Text } = Typography;

const TasksPopover = ({ project, userId, onClose }) => {
  const { handleGetTasklistPopover } = DashboardController();

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const QUERY_KEY_TASK_LIST_POPOVER = [
    "task_list_popover",
    organization_id,
    userId,
  ];

  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEY_TASK_LIST_POPOVER,
    queryFn: () =>
      handleGetTasklistPopover(organization_id, userId, project.id),
    select: (data) => {
      let newData = data?.map((item) => {
        let newItem = { ...item };
        let totalHoursWorkedInTimelogs = 0;
        if (item.timelog_data && Array.isArray(item.timelog_data)) {
          item.timelog_data.forEach((timelog) => {
            if (timelog.hours_worked !== null) {
              totalHoursWorkedInTimelogs += timelog.hours_worked;
            }
          });
        }
        newItem.total_worked_hours = totalHoursWorkedInTimelogs;
        return newItem;
      });

      return newData;
    },
    refetchOnWindowFocus: false,
    enabled: !!organization_id || !!userId,
    staleTime: 10,
    keepPreviousData: true,
  });
  return (
    <Popover
      open={project !== null}
      overlayStyle={{ maxWidth: 400, minWidth: 400 }}
      placement="leftBottom"
      content={
        isFetching && !data ? (
          <div style={{ textAlign: "center" }} className="example">
            <Spin />
          </div>
        ) : (
          <TasksPopoverContent data={data} />
        )
      }
      title={
        <TasksPopoverTitle
          projectName={project.name}
          clientName={project.client.name}
        />
      }
      trigger="click"
      onOpenChange={(visible) => {
        if (!visible) {
          onClose(); // Close the popover when it's not visible
        }
      }}
    />
  );
};
export default TasksPopover;
