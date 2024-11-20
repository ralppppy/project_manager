import { Col, Row } from "antd";
import React, { Suspense } from "react";
import { TasksListModalForm, TasksTable } from "../../TasksList/components";
import { HeaderCards } from "../../Dashboard/components";
import { ProjectList } from ".";

const TOTAL_SPAN = 24;

function FeedbackListsSingle() {
  return (
    <div>
      <Row gutter={[10, 10]}>
        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: TOTAL_SPAN }}
          lg={{ span: TOTAL_SPAN }}
          xl={{ span: TOTAL_SPAN }}
          xxl={{ span: TOTAL_SPAN }}
        >
          <HeaderCards isFeedback={true} />
        </Col>
        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: 4 }}
          lg={{ span: 4 }}
          xl={{ span: 4 }}
          xxl={{ span: 4 }}
        >
          <ProjectList isFeedback={true} />
        </Col>

        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: 20 }}
          lg={{ span: 20 }}
          xl={{ span: 20 }}
          xxl={{ span: 20 }}
        >
          <TasksTable isFeedback={true} />
        </Col>
      </Row>
    </div>
  );
}

export default FeedbackListsSingle;
