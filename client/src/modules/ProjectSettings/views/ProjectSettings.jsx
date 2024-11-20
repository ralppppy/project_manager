import React, { Suspense } from "react";
import { Col, Row, Typography, Space, Tabs } from "antd";
import { useSelector } from "react-redux";
import DropdownSettings from "../components/DropdownSettings/DropdownSettings";
import { TaskSettings } from "../components/TaskSettings";
import { UserTypeSettings } from "../components/UserTypeSettings";

const { Title } = Typography;
const TOTAL_SPAN = 24;

function ProjectSettings() {
  const items = [
    {
      key: "1",
      label: "Dropdown Settings",
      children: (
        <Suspense fallback={<></>}>
          {" "}
          <DropdownSettings />
        </Suspense>
      ),
    },
    {
      key: "2",
      label: "Task Settings",
      children: (
        <Suspense fallback={<></>}>
          <TaskSettings />
        </Suspense>
      ),
    },
    {
      key: "3",
      label: "User type Page Assignment",
      children: (
        <Suspense fallback={<></>}>
          <UserTypeSettings />
        </Suspense>
      ),
    },
  ];

  return (
    <>
      <Suspense fallback={<></>}>
        <Row gutter={[10, 10]}>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: 13 }}
            lg={{ span: 15 }}
            xl={{ span: 15 }}
            xxl={{ span: 18 }}
          >
            <Title level={3}>Project Settings</Title>
          </Col>

          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: TOTAL_SPAN }}
            lg={{ span: TOTAL_SPAN }}
            xl={{ span: TOTAL_SPAN }}
            xxl={{ span: TOTAL_SPAN }}
          >
            <Tabs defaultActiveKey="3" items={items} />
          </Col>
        </Row>
      </Suspense>
    </>
  );
}

export default ProjectSettings;
