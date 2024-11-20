import { DatePicker, Form, Input, Typography, theme } from "antd";
import React, { useEffect, useState } from "react";

import { EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

const { Text } = Typography;
function DeadlineForm({ form, updateTask }) {
  const [click, setClick] = useState(false);
  const deadline = Form.useWatch("deadline", form);

  const isUpdate = useSelector((state) => state.taskList.isUpdate);
  const updateData = useSelector((state) => state.taskList.updateData);
  const isView = useSelector((state) => state.taskList.isView);
  const isEmployee = useSelector((state) => state.login.user.is_employee);

  const { token } = theme.useToken();

  useEffect(() => {
    if (isUpdate) {
      form.setFieldValue("deadline", updateData.deadline);
    }
  }, [isUpdate, updateData]);

  return (
    <>
      <Form.Item hidden name="deadline">
        <Input />
      </Form.Item>

      {click ? (
        <DatePicker
          defaultValue={deadline ? dayjs(deadline) : null}
          autoFocus
          onBlur={(e) => {
            let value = e.target.value;

            setClick(false);

            if (isView) {
              let values = { deadline: value ? dayjs(value) : value };

              updateTask({
                values,
                task_id: updateData.id,
              });
            }

            form.setFieldValue("deadline", value ? dayjs(value) : value);
          }}
          format={"DD MMMM, YYYY"}
        />
      ) : (
        <Text
          editable={{
            icon: (
              <EditOutlined
                id="edit-deadline"
                style={{ color: token.colorText }}
              />
            ),
            onStart: () => {
              setClick((prev) => !prev);
            },
          }}
          // editable={
          //   isEmployee ||
          //     ? {
          //         icon: (
          //           <EditOutlined
          //             id="edit-deadline"
          //             style={{ color: token.colorText }}
          //           />
          //         ),
          //         onStart: () => {
          //           setClick((prev) => !prev);
          //         },
          //       }
          //     : false
          // }
        >
          {deadline ? dayjs(deadline).format("DD MMMM, YYYY") : "N/A"}
          {/* {dayjs(data?.createdAt).format("DD MMMM, YYYY")} */}
        </Text>
      )}
    </>
  );
}

export default React.memo(DeadlineForm);
