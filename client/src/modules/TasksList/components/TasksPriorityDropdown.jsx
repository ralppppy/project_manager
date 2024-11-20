import { Button, Dropdown, Form, Tooltip } from "antd";
import React, { useEffect } from "react";
import { TaskListController } from "../controllers";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { FlagTwoTone } from "@ant-design/icons";

function TasksPriorityDropdown({ form, updateTask }) {
  const task_priority_id = Form.useWatch("task_priority_id", form);
  const isUpdate = useSelector((state) => state.taskList.isUpdate);
  const updateData = useSelector((state) => state.taskList.updateData);
  const queryClient = useQueryClient();
  const isView = useSelector((state) => state.taskList.isView);
  const currentUserId = useSelector((state) => state.login.user.id);

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  let QUERY_KEY_TASK_PRIORITY = ["tasks_priority_dropdown", organization_id];

  const [[_, data]] = queryClient.getQueriesData(QUERY_KEY_TASK_PRIORITY);

  useEffect(() => {
    if (isUpdate) {
      form?.setFieldValue("task_priority_id", updateData.task_priority.id);
    } else {
      if (data && form) {
        form?.setFieldValue("task_priority_id", data[0]?.id);
      }
    }
  }, [form, isUpdate, updateData]);

  return (
    <Form.Item name="task_priority_id">
      <Tooltip
        title={`Task Priority | ${
          data?.find((d) => d.id === task_priority_id)?.label
        }`}
      >
        <Dropdown
          menu={{
            items: data,
            onSelect: ({ key }) => {
              if (isView) {
                let values = { task_priority_id: parseInt(key) };

                updateTask({
                  values,
                  task_id: updateData.id,
                  updateType: {
                    key: "tasks_priority_dropdown",
                    name: "task_priority_id",
                    property: "task_priority",
                  },
                });
              }

              form?.setFieldValue("task_priority_id", parseInt(key));
            },
            selectable: true,
            defaultSelectedKeys: [`${task_priority_id}`],
          }}
          trigger={
            !isUpdate || currentUserId === updateData?.creator?.id
              ? ["click"]
              : []
          }
        >
          <Button
            shape="circle"
            type="dashed"
            style={{
              borderColor: data?.find((d) => d.id === task_priority_id)?.color,
            }}
            icon={
              <FlagTwoTone
                twoToneColor={
                  data?.find((d) => d.id === task_priority_id)?.color
                }
              />
            }
          />
        </Dropdown>
      </Tooltip>
    </Form.Item>
  );
}

export default TasksPriorityDropdown;
