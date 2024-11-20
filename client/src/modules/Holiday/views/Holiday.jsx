import React, { Suspense } from "react";
import { Col, Row, Typography } from "antd";
import { HolidayTable } from "../components";

const { Title } = Typography;
const TOTAL_SPAN = 24;

function Holiday() {
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
            <Title level={3}>Holidays</Title>
          </Col>
        </Row>

        <HolidayTable />
      </Suspense>
    </>
  );
}

export default Holiday;
