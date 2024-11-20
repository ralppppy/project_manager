import React, { Suspense } from "react";
import { Row, Col, Grid, Layout } from "antd";
import { Outlet, useNavigate, useResolvedPath } from "react-router-dom";
import { Footer, LeftColumnText } from "../components";

const TOTAL_SPAN = 24;

const { useBreakpoint } = Grid;

function GuestLayout() {
  const screens = useBreakpoint();

  return (
    <Layout style={{ height: "100%" }}>
      <Row style={{ minHeight: "100%", overflow: "hidden" }}>
        <Col
          xs={{ span: 0 }}
          sm={{ span: 0 }}
          md={{ span: 10 }}
          lg={{ span: 10 }}
          xl={{ span: 10 }}
          xxl={{ span: 10 }}
          className="left-column"
        >
          <Suspense fallback={<></>}>
            <LeftColumnText />
          </Suspense>
        </Col>
        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: 14 }}
          lg={{ span: 14 }}
          xl={{ span: 14 }}
          xxl={{ span: 14 }}
        >
          <Suspense fallback={<></>}>
            <Outlet />
            {screens.lg && <Footer />}
          </Suspense>
        </Col>
      </Row>
    </Layout>
  );
}

export default GuestLayout;
