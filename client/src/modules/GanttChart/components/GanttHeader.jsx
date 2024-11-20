import React, { useEffect } from "react";
import { Typography, Row, Col } from "antd";
import FilterStatus from "../../Common/components/FilterStatus";
import { useQueryClient } from "react-query";
import { FilterStatusGanttChart } from "../../Common/components";
const { Title } = Typography;
const TOTAL_SPAN = 24;
function GanttHeader() {
  return (
    <Row gutter={[10, 10]}>
      <Col
        xs={{ span: TOTAL_SPAN }}
        sm={{ span: TOTAL_SPAN }}
        md={{ span: 4 }}
        lg={{ span: 4 }}
        xl={{ span: 4 }}
        xxl={{ span: 4 }}
      >
        <Title level={3}>Gantt Chart</Title>
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
        <FilterStatusGanttChart />
      </Col>
    </Row>
  );
}

export default GanttHeader;
