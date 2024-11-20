import {
  Avatar,
  Button,
  Card,
  Col,
  Row,
  Space,
  Tooltip,
  Typography,
  theme,
} from "antd";
import React from "react";
import "../components/styles.css";
import { secondsToHHMM } from "../../../common/TimeHelper";
import dayjs from "dayjs";
import { TaskListController } from "../../TasksList/controllers";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const { Text } = Typography;

const TasksPopoverContent = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleModalOpen } = TaskListController({ navigate, dispatch });

  const { token } = theme.useToken();

  return (
    <div className="task-popover">
      <Space
        direction="vertical"
        size="middle"
        style={{
          display: "flex",
        }}
      >
        {data?.map((c) => {
          return (
            <Card
              onClick={() => {
                handleModalOpen(true, true, c, true);
              }}
              key={c.id}
              title={
                <div className="d-flex align-items-center justify-content-between">
                  <Space size="small" className="mt-2 mb-2">
                    <Text
                      style={{
                        borderColor: c.task_type.color,
                        color: c.task_type.color,
                        borderRadius: token.borderRadius,
                        border: `1px  solid ${c.task_type.color}`,
                        padding: token.paddingXS - 2,
                      }}
                    >
                      {c.task_type.name}
                    </Text>
                    <Text
                      style={{
                        borderColor: c.task_priority.color,
                        color: c.task_priority.color,
                        borderRadius: token.borderRadius,
                        border: `1px  solid ${c.task_priority.color}`,
                        padding: token.paddingXS - 2,
                      }}
                    >
                      {c.task_priority.name}
                    </Text>
                  </Space>
                  <Text className="mt-1">
                    {secondsToHHMM(c.total_worked_hours || 0)} /
                    {secondsToHHMM(c.time_estimate)}
                  </Text>
                </div>
              }
              size="small"
              bodyStyle={{
                maxHeight: "200px",
                minHeight: "200px",
                display: "flex",
                flexDirection: "column",
              }}
              hoverable
            >
              <Text strong>{c.task_title}</Text>

              <div
                dangerouslySetInnerHTML={{ __html: c.instruction }}
                style={{
                  flex: 1,
                  maxHeight: "150px", // Limit the maximum height
                  overflowY: "auto",
                  overflowX: "hidden", // Add a scrollbar when content is too long
                }}
              />
              <div className="d-flex align-items-center justify-content-between mt-1">
                <Text>
                  Created By: {c.creator.first_name} {c.creator.last_name}
                </Text>

                <Avatar.Group size={"small"} maxCount={5}>
                  {c.team.map((d, index) => (
                    <Tooltip
                      key={index}
                      title={`${d.user.first_name} ${d.user.last_name}`}
                      placement="top"
                    >
                      <Avatar
                        style={{
                          backgroundColor: "#f56a00",
                          cursor: "pointer",
                        }}
                      >
                        {d.user.first_name.charAt(0).toUpperCase()}
                        {d.user.last_name.charAt(0).toUpperCase()}
                      </Avatar>
                    </Tooltip>
                  ))}
                </Avatar.Group>
              </div>
              <Text>{dayjs.utc(c.createdAt).format("DD-MM-YYYY")}</Text>
            </Card>
          );
        })}
      </Space>
    </div>
  );
};

export default TasksPopoverContent;
