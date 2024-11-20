import { Form, Typography, theme } from "antd";
import React, { useEffect } from "react";
import { EditOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Title } = Typography;

function TaskTitleForm({ form, updateTask }) {
  const { token } = theme.useToken();
  const task_title = Form.useWatch("task_title", form);
  const isUpdate = useSelector((state) => state.taskList.isUpdate);
  const updateData = useSelector((state) => state.taskList.updateData);
  const isView = useSelector((state) => state.taskList.isView);
  const currentUserId = useSelector((state) => state.login.user.id);

  useEffect(() => {
    if (isUpdate) {
      form.setFieldValue("task_title", updateData.task_title);
    }
  }, [isUpdate, updateData]);

  return (
    <Form.Item
      name="task_title"
      help={task_title ? "" : "Please enter task title"}
      rules={[{ required: true, message: "This is required" }]}
    >
      <Title
        editable={
          !isUpdate || currentUserId === updateData?.creator?.id
            ? {
                onChange: (value) => {
                  if (isView) {
                    let values = { task_title: value };

                    updateTask({
                      values,
                      task_id: updateData.id,
                    });
                  }

                  form.setFieldValue("task_title", value);
                },
                icon: <EditOutlined style={{ color: token.colorText }} />,
                triggerType: "text",
              }
            : false
        }
        level={4}
      >
        {task_title ? task_title : "Enter task title"}
      </Title>
    </Form.Item>
  );
}

export default React.memo(TaskTitleForm);
