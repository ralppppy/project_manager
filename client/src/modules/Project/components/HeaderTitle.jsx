import React from "react";
import { Col, Row } from "antd";

import { AddProjectButton, SetProjectPriority, SwitchesFilter } from ".";

const TOTAL_SPAN = 24;

function HeaderTitle({ QUERY_KEY }) {
  return (
    <Row gutter={[10, 10]}>
      <Col
        xs={{ span: TOTAL_SPAN }}
        sm={{ span: TOTAL_SPAN }}
        md={{ span: 14 }}
        lg={{ span: 11 }}
        xl={{ span: 9 }}
        xxl={{ span: 6 }}
        className="text-center"
      >
        <Row gutter={[10, 10]}>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: TOTAL_SPAN / 3 }}
            lg={{ span: TOTAL_SPAN / 3 }}
            xl={{ span: TOTAL_SPAN / 3 }}
            xxl={{ span: TOTAL_SPAN / 3 }}
          >
            <AddProjectButton QUERY_KEY={QUERY_KEY} />
          </Col>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: TOTAL_SPAN / 3 }}
            lg={{ span: TOTAL_SPAN / 3 }}
            xl={{ span: TOTAL_SPAN / 3 }}
            xxl={{ span: TOTAL_SPAN / 3 }}
            className="d-flex align-items-center justify-content-center"
          >
            <SetProjectPriority QUERY_KEY={QUERY_KEY} />
          </Col>
        </Row>
      </Col>

      <Col
        xs={{ span: TOTAL_SPAN }}
        sm={{ span: TOTAL_SPAN }}
        md={{ span: 10, offset: 0 }}
        lg={{ span: 9, offset: 4 }}
        xl={{ span: 7, offset: 8 }}
        xxl={{ span: 5, offset: 13 }}
      >
        <SwitchesFilter />
      </Col>
    </Row>
  );
}

export default React.memo(HeaderTitle);
