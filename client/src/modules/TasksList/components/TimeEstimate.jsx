import {
  Form,
  Input,
  InputNumber,
  Space,
  Tooltip,
  Typography,
  theme,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  EditOutlined,
  ClockCircleTwoTone,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import InputMask from "react-input-mask";
import "./style.css";
import { useSelector } from "react-redux";

const { Text } = Typography;
function convertToSeconds(time) {
  const [hours, minutes] = time.split(":");
  const totalSeconds =
    parseInt(hours, 10) * 60 * 60 + parseInt(minutes, 10) * 60;
  return totalSeconds;
}

function convertToHHMM(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
  return formattedTime;
}

function TimeEstimate({ form, updateTask }) {
  const [click, setClick] = useState(false);
  const time_estimate = Form.useWatch("time_estimate", form);
  const isUpdate = useSelector((state) => state.taskList.isUpdate);
  const updateData = useSelector((state) => state.taskList.updateData);
  const isView = useSelector((state) => state.taskList.isView);

  const isEmployee = useSelector((state) => state.login.user.is_employee);

  const { token } = theme.useToken();

  useEffect(() => {
    if (isUpdate) {
      form.setFieldValue("time_estimate", updateData.time_estimate);
    }
  }, [isUpdate, updateData]);

  return (
    <>
      <Form.Item hidden name="time_estimate">
        <Input />
      </Form.Item>
      {click ? (
        <InputMask
          placeholder="HH:mm"
          className={`custom-input w-50`}
          mask="99:99"
          defaultValue={convertToHHMM(time_estimate || 0)}
          onBlur={(e) => {
            let value = e.target.value;
            setClick(false);

            if (isView) {
              let values = {
                time_estimate: convertToSeconds(value),
                is_time_estimate_approved: false,
              };

              updateTask({
                values,
                task_id: updateData.id,
              });
            }
            form.setFieldValue("time_estimate", convertToSeconds(value));
          }}
          onKeyDown={(e) => {
            e.key === "Enter" && e.preventDefault();
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();

              let value = e.target.value;

              setClick(false);

              if (isView) {
                let values = {
                  time_estimate: convertToSeconds(value),
                  is_time_estimate_approved: false,
                };

                updateTask({
                  values,
                  task_id: updateData.id,
                });
              }

              form.setFieldValue("time_estimate", convertToSeconds(value));
            }
          }}
          formatChars={{
            9: "[0-9]",
          }}
        >
          {(inputProps) => <input {...inputProps} />}
        </InputMask>
      ) : (
        <Text
          editable={
            isEmployee
              ? {
                  icon: <EditOutlined style={{ color: token.colorText }} />,
                  onStart: () => {
                    setClick((prev) => !prev);
                  },
                }
              : false
          }
        >
          {time_estimate ? convertToHHMM(time_estimate) : "00:00"}{" "}
          {time_estimate && isUpdate && (
            <Tooltip
              title={
                updateData?.is_time_estimate_approved ? "Approved" : "Pending"
              }
            >
              {updateData?.is_time_estimate_approved ? (
                <CheckCircleTwoTone
                  onClick={() => {
                    if (isView) {
                      let values = {
                        is_time_estimate_approved:
                          !updateData?.is_time_estimate_approved,
                      };

                      updateTask({
                        values,
                        task_id: updateData.id,
                      });
                    }
                  }}
                  style={{ cursor: "pointer" }}
                  twoToneColor="#52c41a"
                />
              ) : (
                <ClockCircleTwoTone
                  onClick={() => {
                    if (isView) {
                      let values = {
                        is_time_estimate_approved:
                          !updateData?.is_time_estimate_approved,
                      };

                      updateTask({
                        values,
                        task_id: updateData.id,
                      });
                    }
                  }}
                  style={{ cursor: "pointer" }}
                  twoToneColor="#ffa500"
                />
              )}
            </Tooltip>
          )}
        </Text>
      )}
    </>
  );
}

export default React.memo(TimeEstimate);
