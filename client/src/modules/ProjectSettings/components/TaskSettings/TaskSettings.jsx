import { Col, Row, Typography } from "antd";
import React from "react";
import { TaskCompletion } from ".";

const TOTAL_SPAN = 24;

function TaskSettings() {
  return (
    <Row gutter={[10, 10]}>
      <Col
        xs={{ span: TOTAL_SPAN }}
        sm={{ span: TOTAL_SPAN }}
        md={{ span: TOTAL_SPAN / 4 }}
        lg={{ span: TOTAL_SPAN / 4 }}
        xl={{ span: TOTAL_SPAN / 4 }}
        xxl={{ span: TOTAL_SPAN / 4 }}
      >
        <TaskCompletion />
      </Col>
    </Row>
  );
}

export default TaskSettings;
