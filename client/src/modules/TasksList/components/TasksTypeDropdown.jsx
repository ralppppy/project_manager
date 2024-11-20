import { Button, Dropdown, Form, Tooltip } from "antd";
import React, { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";

function TasksTypeDropdown({ form, updateTask }) {
  const task_type_id = Form.useWatch("task_type_id", form);
  const isUpdate = useSelector((state) => state.taskList.isUpdate);
  const updateData = useSelector((state) => state.taskList.updateData);
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );
  const isView = useSelector((state) => state.taskList.isView);
  const isEmployee = useSelector((state) => state.login.user.is_employee);
  const currentUserId = useSelector((state) => state.login.user.id);

  const queryClient = useQueryClient();

  let QUERY_KEY_TASK_TYPE = ["tasks_type_dropdown", organization_id];

  const [[_, data]] = queryClient.getQueriesData(QUERY_KEY_TASK_TYPE);

  useEffect(() => {
    if (isUpdate) {
      form?.setFieldValue("task_type_id", updateData.task_type.id);
    } else {
      if (data && form) {
        form?.setFieldValue("task_type_id", data[0]?.id);
      }
    }
  }, [form, isUpdate, updateData]);

  return (
    <Form.Item name="task_type_id">
      <Tooltip
        title={`Task type | ${data?.find((d) => d.id === task_type_id)?.label}`}
      >
        <Dropdown
          menu={{
            items: data,
            onSelect: ({ key }) => {
              if (isView) {
                let values = { task_type_id: parseInt(key) };

                updateTask({
                  values,
                  task_id: updateData.id,
                  updateType: {
                    key: "tasks_type_dropdown",
                    name: "task_type_id",
                    property: "task_type",
                  },
                });
              }

              form?.setFieldValue("task_type_id", parseInt(key));
            },
            selectable: true,
            defaultSelectedKeys: [`${task_type_id}`],
          }}
          trigger={
            !isUpdate || currentUserId === updateData?.creator?.id
              ? ["click"]
              : []
          }
        >
          <Button
            style={{
              borderColor: data?.find((d) => d.id === task_type_id)?.color,
              color: data?.find((d) => d.id === task_type_id)?.color,
            }}
            type="dashed"
          >
            {" "}
            {data && data.find((d) => d.id === task_type_id)?.label}
          </Button>
        </Dropdown>
      </Tooltip>
    </Form.Item>
  );
}

export default TasksTypeDropdown;
