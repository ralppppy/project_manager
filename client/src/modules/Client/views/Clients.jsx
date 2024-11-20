import React, { Suspense } from "react";
import { Col, Row, Typography } from "antd";
import { ClientTable, ProjectDetails } from "../components";

const { Title } = Typography;
const TOTAL_SPAN = 24;

function Clients() {
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
            <Title level={3}>Clients</Title>
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

        <ClientTable />
      </Suspense>
    </>
  );
}

export default Clients;
