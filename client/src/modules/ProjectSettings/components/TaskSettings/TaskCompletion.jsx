import { Card, Select, Space, Typography, message } from "antd";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { ProjectSettingsController } from "../../controllers";

import { TaskListController } from "@modules/TasksList/controllers";
const { Paragraph } = Typography;

function TaskCompletion() {
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );
  const [messageApi, contextHolder] = message.useMessage();

  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  const { handleGetTaskTypeDropdown } = TaskListController({ dispatch });

  const { handleSetCompletionStatus, handleGetCompletionStatus } =
    ProjectSettingsController({});

  let QUERY_KEY_TASK_STATUS = [
    "project_settings_tasks_status_dropdown",
    organization_id,
  ];
  let QUERY_KEY_COMPLETION_STATUS = [
    "project_settings_completion_status_data",
    organization_id,
  ];

  const { data, isFetching, isLoading } = useQuery({
    queryKey: QUERY_KEY_TASK_STATUS,
    queryFn: () => handleGetTaskTypeDropdown(organization_id, "tasks_status"),

    enabled: !!organization_id,
    keepPreviousData: true,

    staleTime: Infinity,
  });

  const { data: completionStatusData, isFetching: completionIsFetching } =
    useQuery({
      queryKey: QUERY_KEY_COMPLETION_STATUS,
      queryFn: () => handleGetCompletionStatus({ organization_id }),
      onSettled: () => {
        queryClient.invalidateQueries(["task_completion_percent"]);
        queryClient.invalidateQueries(["module_lists"]);
      },

      enabled: !!organization_id,
      keepPreviousData: true,

      staleTime: Infinity,
    });

  const mutation = useMutation({
    mutationFn: handleSetCompletionStatus,
    onSuccess: (status_id) => {
      queryClient.setQueryData(QUERY_KEY_COMPLETION_STATUS, (prevData) => {
        let newSelected = data.find((c) => c.id === status_id);

        let newData = { ...prevData.data, task_status_id: newSelected.id };

        return { ...prevData, data: newData };
      });

      queryClient.invalidateQueries(["task_completion_percent"]);

      messageApi.open({
        type: "success",
        content: "Succesfully updated status definition",
      });
    },
  });

  return (
    <>
      {contextHolder}
      <Card className="w-100" title="Task Completion Status Definitions">
        <Paragraph>
          This settings allows you to define and customize the criteria for task
          completion statuses. Tailor the definitions to match your unique
          workflow, providing clarity on when tasks are considered completed or
          in progress
        </Paragraph>
        {!completionIsFetching && (
          <Select
            onChange={(selected) => {
              mutation.mutate({ organization_id, status_id: selected });
            }}
            defaultValue={completionStatusData?.data?.task_status_id}
            className="w-100"
            placeholder="Complete status"
            options={data?.map((d) => ({ ...d, value: d.id }))}
          />
        )}
      </Card>
    </>
  );
}

export default TaskCompletion;
