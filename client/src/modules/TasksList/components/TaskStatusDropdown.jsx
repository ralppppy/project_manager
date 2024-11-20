import { Button, Dropdown, Form, Tooltip } from "antd";
import React, { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";

function TaskStatusDropdown({ form, updateTask }) {
  // const task_status_id = form.getFieldValue("task_status_id");
  const task_status_id = Form.useWatch("task_status_id", form);
  const isUpdate = useSelector((state) => state.taskList.isUpdate);
  const updateData = useSelector((state) => state.taskList.updateData);
  const queryClient = useQueryClient();
  const currentUserId = useSelector((state) => state.login.user.id);

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );
  const isView = useSelector((state) => state.taskList.isView);

  let QUERY_KEY_TASK_STATUS = ["tasks_status_dropdown", organization_id];

  const [[_, data]] = queryClient.getQueriesData(QUERY_KEY_TASK_STATUS);

  useEffect(() => {
    if (isUpdate) {
      form?.setFieldValue("task_status_id", updateData.task_status.id);
    } else {
      if (data && form) {
        form?.setFieldValue("task_status_id", data[0]?.id);
      }
    }
  }, [form, isUpdate, updateData]);

  return (
    <Form.Item name="task_status_id">
      <Tooltip
        title={`Task status | ${
          data?.find((d) =>
            d.id === isUpdate ? updateData.task_status.id : task_status_id
          )?.label
        }`}
      >
        <Dropdown
          menu={{
            items: data,
            // items: data,
            onSelect: (selectedStatus) => {
              let { key } = selectedStatus;

              if (isView) {
                let values = { task_status_id: parseInt(key) };

                updateTask({
                  values,
                  task_id: updateData.id,
                  updateType: {
                    key: "tasks_status_dropdown",
                    name: "task_status_id",
                    property: "task_status",
                  },
                });
              }

              form?.setFieldValue("task_status_id", parseInt(key));
            },
            selectable: true,
            defaultSelectedKeys: [`${task_status_id}`],
          }}
          trigger={
            !isUpdate || currentUserId === updateData?.creator?.id
              ? ["click"]
              : []
          }
        >
          <Button
            style={{
              borderColor: data?.find((d) => d.id === task_status_id)?.color,
              color: data?.find((d) => d.id === task_status_id)?.color,
            }}
            type="dashed"
          >
            {data && data.find((d) => d.id === task_status_id)?.label}
          </Button>
        </Dropdown>
      </Tooltip>
    </Form.Item>
  );
}

export default TaskStatusDropdown;
