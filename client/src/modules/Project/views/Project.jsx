import React, { Suspense } from "react";
import ProjectTable from "../components/ProjectTable";
import { Col, Row, Typography } from "antd";
import { ProjectDetails } from "../components";
// import { ProjectDetails } from "../components";

const { Title } = Typography;
const TOTAL_SPAN = 24;

function Project() {
  return (
    <>
      <Suspense fallback={<></>}>
        <Row gutter={[16, 16]}>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: 13 }}
            lg={{ span: 15 }}
            xl={{ span: 15 }}
            xxl={{ span: 18 }}
          >
            <Title level={3}>Projects</Title>
          </Col>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: 11 }}
            lg={{ span: 9 }}
            xl={{ span: 9 }}
            xxl={{ span: 6 }}
          >
            <div className="d-flex align-item-center justify-content-end">
              <ProjectDetails />
            </div>
          </Col>
        </Row>

        <ProjectTable />
      </Suspense>
    </>
  );
}

export default Project;
