import { Table, Typography } from "antd";
import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { GanttChartController } from "../controllers";
import { useQuery } from "react-query";
import { ExtraDataTable } from ".";
import dayjs from "dayjs";

const { Text } = Typography;
function SummaryTable() {
  const { getMinAndMaxDate2 } = GanttChartController({});

  const columns = [
    {
      title: "Assinnees",
      dataIndex: "name",
      key: "name",
      render: (value, record) => {
        return (
          <Text>
            {record.last_name}, {record.first_name}
          </Text>
        );
      },
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (_, record) => {
        let [startDate] = getMinAndMaxDate2(
          record.gantt_chart_data,
          "start_date",
          "end_date",
          true
        );

        return <Text> {dayjs.utc(startDate).format("MM-DD-YYYY")}</Text>;
      },
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (_, record) => {
        let [__, endDate] = getMinAndMaxDate2(
          record.gantt_chart_data,
          "start_date",
          "end_date",
          true
        );

        return (
          <Text> {dayjs.utc(endDate).add(1, "hour").format("MM-DD-YYYY")}</Text>
        );
      },
    },
    {
      title: "Total work days",
      dataIndex: "totalWorkDays",
      key: "totalWorkDays",
      render: (_, record) => {
        let [startDate, endDate] = getMinAndMaxDate2(
          record.gantt_chart_data,
          "start_date",
          "end_date",
          true
        );

        return (
          <Text>
            {dayjs.utc(endDate).add(1, "hour").diff(startDate, "day")}
          </Text>
        );
      },
    },
  ];

  const { handleGetSummary } = GanttChartController({});

  const { clientId, projectId } = useSelector(
    (state) => state.common.selectedFilter
  );

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const QUERY_KEY_SUMMARY_TABLE = [
    "summary_table",
    organization_id,
    clientId,
    projectId,
  ];

  const { data } = useQuery({
    queryKey: QUERY_KEY_SUMMARY_TABLE,
    queryFn: () =>
      handleGetSummary({
        organization_id,
        clientId,
        projectId,
      }),

    enabled: !!organization_id,
    staleTime: 10,
  });

  return (
    <Table
      expandable={{
        expandedRowRender: (record) => (
          <Suspense fallback={<></>}>
            <ExtraDataTable data={record.gantt_chart_data} />
          </Suspense>
        ),
        rowExpandable: (record) => record.name !== "Not Expandable",
      }}
      pagination={false}
      dataSource={data?.data}
      columns={columns}
    />
  );
}

export default SummaryTable;
