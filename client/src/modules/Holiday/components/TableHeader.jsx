import React, { Suspense } from "react";
import { Button, Col, Row } from "antd";

import { PlusOutlined } from "@ant-design/icons";
import { HolidayModalForm } from ".";
import { useDispatch } from "react-redux";
import { HolidayController } from "../controllers";

const TOTAL_SPAN = 24;

function TableHeader() {
  const dispatch = useDispatch();
  const { handleModalOpen } = HolidayController({ dispatch });

  return (
    <>
      <Row gutter={[10, 10]}>
        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: 4 }}
          lg={{ span: 4 }}
          xl={{ span: 3 }}
          xxl={{ span: 2 }}
          className="text-center"
        >
          <Button
            className="w-100"
            onClick={() => {
              handleModalOpen(true);
            }}
            icon={<PlusOutlined />}
            type="primary"
          >
            Add Holiday
          </Button>
        </Col>
      </Row>
      <Suspense fallback={<></>}>
        <HolidayModalForm />
      </Suspense>
    </>
  );
}

export default React.memo(TableHeader);
