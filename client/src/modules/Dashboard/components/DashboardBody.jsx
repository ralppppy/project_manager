import { Col, Row, Tabs } from "antd";
import React, { Suspense } from "react";
import { PointFilter, UnassignedTaskTable } from ".";

import UnassignedProjectTable from "./UnassignedProjectTable";
import AssignedTabs from "./AssignedTabs";
import { TasksTable } from "@modules/TasksList/components";
import FilterClientProjectModule from "../../Common/components/FilterClientProjectModule";
import { TasksListModalForm } from "../../TasksList/components";
import BarChart from "./BarChart";
import AssignedTable from "./AssignedTable";
import { DashboardController } from "../controller";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
const TOTAL_SPAN = 24;

const DashboardBody = () => {
  const items = [
    {
      label: "My Task",
      key: "1",
      children: (
        <>
          <Suspense fallback={<></>}>
            <Row gutter={[10, 10]}>
              <Col
                xs={{ span: TOTAL_SPAN }}
                sm={{ span: TOTAL_SPAN }}
                md={{ span: 4 }}
                lg={{ span: 4 }}
                xl={{ span: 4 }}
                xxl={{ span: 4 }}
              >
                <PointFilter />
              </Col>
              <Col
                xs={{ span: TOTAL_SPAN }}
                sm={{ span: TOTAL_SPAN }}
                md={{ span: 10, offset: 10 }}
                lg={{ span: 7, offset: 13 }}
                xl={{ span: 7, offset: 13 }}
                xxl={{ span: 6, offset: 14 }}
                className="d-flex align-items-center justify-content-end"
              >
                <FilterClientProjectModule queryKey="dashboard_filter_key" />
              </Col>
            </Row>

            <TasksTable isDashboard={true} />

            <Suspense fallback={<></>}>
              <TasksListModalForm
                isDashboard={true}
                queryKey="dashboard_filter_key"
              />{" "}
            </Suspense>
          </Suspense>
        </>
      ),
    },
    {
      label: "Staff",
      key: "2",
      children: (
        <>
          <Suspense fallback={<></>}>
            <BarChart />
            <Row gutter={[12, 12]} className="mb-3 h-100">
              <Col
                xs={{ span: TOTAL_SPAN }}
                sm={{ span: TOTAL_SPAN }}
                md={{ span: 12 }}
                lg={{ span: 12 }}
                xl={{ span: 12 }}
                xxl={{ span: 12 }}
              >
                <UnassignedProjectTable />
              </Col>
              <Col
                xs={{ span: TOTAL_SPAN }}
                sm={{ span: TOTAL_SPAN }}
                md={{ span: 12 }}
                lg={{ span: 12 }}
                xl={{ span: 12 }}
                xxl={{ span: 12 }}
              >
                <UnassignedTaskTable />
              </Col>
            </Row>
            <AssignedTabs />
          </Suspense>
        </>
      ),
    },
  ];

  return <Tabs defaultActiveKey="1" centered items={items} />;
};

export default DashboardBody;
