import { Typography, Row, Col } from "antd";
import React, { Suspense, useEffect } from "react";
import {
  FilterStatusContainer,
  ModuleCardsList,
  ProjectList,
} from "../components";
import { useSelector } from "react-redux";
import { redirect, useLoaderData, useNavigate } from "react-router-dom";

const { Title } = Typography;
const TOTAL_SPAN = 24;

function ModuleList() {
  const selectedFilter = useSelector((state) => state.common.selectedFilter);
  const tableQuery = useLoaderData();
  const navigate = useNavigate();
  useEffect(() => {
    if (tableQuery?.redirect) {
      navigate(
        `/module-list/${selectedFilter.clientId}/${selectedFilter.projectId}`,
        { replace: true }
      );
    }
  }, [tableQuery?.redirect]);

  return (
    <div>
      <Suspense fallback={<></>}>
        <Row gutter={[10, 10]}>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: TOTAL_SPAN }}
            lg={{ span: TOTAL_SPAN }}
            xl={{ span: TOTAL_SPAN }}
            xxl={{ span: TOTAL_SPAN }}
          >
            <Row gutter={[10, 10]}>
              <Col
                xs={{ span: TOTAL_SPAN }}
                sm={{ span: TOTAL_SPAN }}
                md={{ span: 4 }}
                lg={{ span: 4 }}
                xl={{ span: 4 }}
                xxl={{ span: 4 }}
              >
                <Title level={3}>Module List</Title>
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
                <FilterStatusContainer />
              </Col>
            </Row>
          </Col>{" "}
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: TOTAL_SPAN }}
            lg={{ span: TOTAL_SPAN }}
            xl={{ span: TOTAL_SPAN }}
            xxl={{ span: TOTAL_SPAN }}
          >
            <Row gutter={[10, 10]}>
              <Col
                xs={{ span: TOTAL_SPAN }}
                sm={{ span: TOTAL_SPAN }}
                md={{ span: TOTAL_SPAN }}
                lg={{ span: 4 }}
                xl={{ span: 4 }}
                xxl={{ span: 4 }}
              >
                <ProjectList />
              </Col>
              <Col
                xs={{ span: TOTAL_SPAN }}
                sm={{ span: TOTAL_SPAN }}
                md={{ span: TOTAL_SPAN }}
                lg={{ span: 20 }}
                xl={{ span: 20 }}
                xxl={{ span: 20 }}
              >
                <ModuleCardsList />
              </Col>
            </Row>
          </Col>
        </Row>
      </Suspense>
    </div>
  );
}

export default ModuleList;
