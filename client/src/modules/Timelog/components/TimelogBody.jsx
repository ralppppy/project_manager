import { Affix, Card, Col, Row, Tabs, Typography } from "antd";
import React, { Suspense, useRef, useState } from "react";
import FilterOptions from "./FilterOptions";
import TimelogCalendar from "./TimelogCalendar";
import FeedbackTree from "./FeedbackTree";
import FeedbackFilterSelect from "./FeedbackFilterSelect";
import HolidayFilterSelect from "./HolidayFilterSelect";
import HolidayTree from "./HolidayTree";

const TOTAL_SPAN = 24;

const { Text } = Typography;

function TimelogBody() {
  const ref = useRef(null);
  const calendar = useRef();
  const items = [
    {
      label: "Points",
      key: "1",
      children: (
        <>
          <Suspense fallback={<></>}>
            <FilterOptions />
            <FeedbackFilterSelect />
            <FeedbackTree calendar={calendar} />
          </Suspense>
        </>
      ),
    },
    {
      label: "Holidays",
      key: "2",
      children: (
        <>
          <Suspense fallback={<></>}>
            <FilterOptions />
            <HolidayFilterSelect />
            <HolidayTree />
          </Suspense>
        </>
      ),
    },
  ];

  return (
    <>
      <Row ref={ref} gutter={[16, 16]}>
        <Col
          xs={{ span: 0 }}
          sm={{ span: 0 }}
          md={{ span: 8 }}
          lg={{ span: 6 }}
          xl={{ span: 6 }}
          xxl={{ span: 4 }}
          className="mb-5"
        >
          <div>
            <Affix offsetTop={64}>
              <Card>
                <Tabs defaultActiveKey="1" centered items={items} />
              </Card>
            </Affix>
          </div>
        </Col>
        <Col
          xs={{ span: 0 }}
          sm={{ span: 0 }}
          md={{ span: 16 }}
          lg={{ span: 18 }}
          xl={{ span: 18 }}
          xxl={{ span: 20 }}
          className="mb-5"
        >
          <TimelogCalendar calendar={calendar} />
        </Col>
        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: 0 }}
          lg={{ span: 0 }}
          xl={{ span: 0 }}
          xxl={{ span: 0 }}
        >
          <Text>Not availalbe on Mobile</Text>
        </Col>
      </Row>
    </>
  );
}

export default TimelogBody;
