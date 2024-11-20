import { Form, Input, List, Popover, Space, Typography, message } from "antd";
import React, { Suspense, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import "./style.css";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { TaskListController } from "../controllers";
import dayjs from "dayjs";
import { AddTaskPopover } from ".";

const { Text } = Typography;

function convertToHHMM(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
  return formattedTime;
}

function HoursWorked({ form, updateTask }) {
  const isUpdate = useSelector((state) => state.taskList.isUpdate);
  const [messageApi, contextHolder] = message.useMessage();
  const updateData = useSelector((state) => state.taskList.updateData);

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );
  const [open, setOpen] = useState(false);

  const isEmployee = useSelector((state) => state.login.user.is_employee);

  const { handleGetTaskHoursWorked, handleOpenChange } = TaskListController({
    setOpen,
  });

  const HOURS_WORKED_KEY = ["hours_worked", updateData.id, isUpdate];

  const { data, isFetching } = useQuery({
    queryKey: HOURS_WORKED_KEY,
    queryFn: () =>
      handleGetTaskHoursWorked({
        task_id: updateData.id,
        organization_id,
      }),

    // This select function processes the input data and performs the following tasks:
    // 1. Calculates the total hours worked by summing up the 'hours_worked' property of each data item.
    // 2. Groups the data by date ('DD-MM-YYYY') and user, aggregating the total hours worked for each user on each date.
    // 3. Returns an object containing the total hours worked ('hoursWorked') and the grouped data ('groupedDate').
    //    The grouped data is structured as follows: { date: { user: totalWorkedHours } }
    //    For example: { '01-01-2023': { 'Doe, John': 8, 'Smith, Jane': 6 } }
    select: (data) => {
      // Step 1: Calculate total hours worked for all data items
      let hoursWorked = data.data.reduce((current, next) => {
        return current + next.hours_worked;
      }, 0);

      // Step 2: Group data by date ('DD-MM-YYYY')
      let groupedDate = {};

      data.data.forEach((timelog) => {
        let key = dayjs.utc(timelog.start_date).format("DD-MM-YYYY");
        if (groupedDate.hasOwnProperty(key)) {
          // Add timelog to existing date group
          groupedDate[key] = [...groupedDate[key], timelog];
        } else {
          // Create a new date group and add timelog
          groupedDate[key] = [timelog];
        }
      });

      for (let key of Object.keys(groupedDate)) {
        // Step 3: Group data by user
        let groupedUser = {};

        groupedDate[key].forEach((d) => {
          let userKey = `${d.user.last_name}. ${d.user.first_name}`;

          if (groupedUser.hasOwnProperty(userKey)) {
            // Add timelog to existing user group
            groupedUser[userKey] = [...groupedUser[userKey], d];
          } else {
            // Create a new user group and add timelog
            groupedUser[userKey] = [d];
          }
        });

        for (let key of Object.keys(groupedUser)) {
          // Calculate total worked hours for each user on the date
          let totalWorkedHours = groupedUser[key].reduce(
            (current, next) => current + next.hours_worked,
            0
          );

          groupedUser[key] = totalWorkedHours;
        }

        // Replace user group with total worked hours for each user
        groupedDate[key] = groupedUser;
      }

      // Return the processed data
      return { ...data, hoursWorked, groupedDate };
    },

    enabled: isUpdate,
    keepPreviousData: true,
    staleTime: Infinity,
  });

  return (
    <>
      {contextHolder}
      <Form.Item hidden name="hours_worked">
        <Input />
      </Form.Item>
      <Space>
        <Popover
          placement="bottom"
          content={
            <Space size="middle" className="w-100" direction="vertical">
              {Object.keys(data?.groupedDate || {}).map((date) => {
                return (
                  <List
                    header={<Text type="secondary">{date}</Text>}
                    size="small"
                    bordered
                    dataSource={Object.keys(data?.groupedDate[date]) || {}}
                    renderItem={(item) => (
                      <List.Item>
                        <Space split={"-"}>
                          <Text style={{ fontSize: 11 }}>
                            {convertToHHMM(
                              parseInt(data?.groupedDate[date][item])
                            )}
                          </Text>
                          <Text style={{ fontSize: 11 }}>{item}</Text>
                        </Space>
                      </List.Item>
                    )}
                  />
                );
              })}
            </Space>
          }
          title="Time logs"
        >
          <Text style={{ cursor: "pointer" }}>
            {data?.hoursWorked ? convertToHHMM(data?.hoursWorked) : "00:00"}
          </Text>
        </Popover>
        {isEmployee && (
          <Suspense fallback={<EditOutlined style={{ cursor: "pointer" }} />}>
            <Popover
              open={open}
              onOpenChange={handleOpenChange}
              content={
                <AddTaskPopover
                  setOpen={setOpen}
                  messageApi={messageApi}
                  task={updateData}
                />
              }
              title={`${updateData.id} - ${updateData.task_title}`}
              trigger={"click"}
            >
              <EditOutlined style={{ cursor: "pointer" }} />
            </Popover>
          </Suspense>
        )}
      </Space>
    </>
  );
}

export default React.memo(HoursWorked);
