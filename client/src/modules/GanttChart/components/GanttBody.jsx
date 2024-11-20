import { Affix, Col, Row } from "antd";
import React, { Suspense } from "react";
import GanttCalendar from "./GanttCalendar";
import GanttEvents from "./GanttEvents";
const GanttBody = () => {
  return (
    <Suspense fallback={<></>}>
      <Row gutter={[16, 16]}>
        <Col
          xs={{ span: 6 }}
          sm={{ span: 6 }}
          md={{ span: 6 }}
          lg={{ span: 4 }}
          xl={{ span: 4 }}
          xxl={{ span: 4 }}
        >
          <Affix offsetTop={64}>
            <GanttEvents />
          </Affix>
        </Col>

        <Col
          xs={{ span: 16 }}
          sm={{ span: 16 }}
          md={{ span: 16 }}
          lg={{ span: 20 }}
          xl={{ span: 20 }}
          xxl={{ span: 20 }}
        >
          <GanttCalendar />
        </Col>
      </Row>
    </Suspense>
  );
};

export default GanttBody;
