import { Table, Typography } from "antd";
import React from "react";
import dayjs from "dayjs";

const { Text } = Typography;

function ExtraDataTable({ data }) {
  const columns = [
    {
      title: "Module name",
      dataIndex: "module",
      key: "module",

      render: (module) => <Text>{module.name}</Text>,
    },
    {
      title: "Task name",
      dataIndex: "task_title",
      key: "task_title",

      render: (_, record) => <Text>{record.task.task_title}</Text>,
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",

      render: (value) => <Text> {dayjs.utc(value).format("MM-DD-YYYY")}</Text>,
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      render: (value) => (
        <Text> {dayjs.utc(value).add(1, "hour").format("MM-DD-YYYY")}</Text>
      ),
    },
    {
      title: "Total days",
      dataIndex: "totalDays",
      key: "totalDays",

      render: (_, record) => {
        return (
          <Text>
            {dayjs
              .utc(dayjs.utc(record.end_date).add(1, "hour"))
              .diff(record.start_date, "day")}
          </Text>
        );
      },
    },
  ];

  console.log(data, "data");

  return (
    <Table
      size="small"
      pagination={false}
      dataSource={data}
      columns={columns}
    />
  );
}

export default ExtraDataTable;
