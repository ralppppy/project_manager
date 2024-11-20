import React, { Suspense } from "react";
import { FeedbackListsSingle } from "../components";
import { Col, Row, Typography } from "antd";
import { FilterStatusFeedbackList } from "../../Common/components";

const { Title } = Typography;

const TOTAL_SPAN = 24;

const FeedbackList = () => {
  return (
    <div>
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
            <Title level={3}>Feedback List</Title>
          </Col>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: 20 }}
            lg={{ span: 20 }}
            xl={{ span: 20 }}
            xxl={{ span: 20 }}
            className="d-flex align-items-center justify-content-end"
          >
            <FilterStatusFeedbackList showTask={false} />;
          </Col>
        </Row>

        <FeedbackListsSingle />
      </Suspense>
    </div>
  );
};

export default FeedbackList;
