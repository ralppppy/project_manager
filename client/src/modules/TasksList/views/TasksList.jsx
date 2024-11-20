import { Button, Col, Row, Space, Typography } from "antd";
import React, { Suspense } from "react";
import { FilterStatusContainer, ProjectList, TasksTable } from "../components";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import HeaderCards from "../../Dashboard/components/HeaderCards";

const { Title } = Typography;

const TOTAL_SPAN = 24;
function TasksList() {
  const { project_id, client_id } = useParams();

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
                <div className="d-flex justify-content-start">
                  <Link to={`/module-list/${client_id}/${project_id}`}>
                    <Button
                      type="link"
                      className="mr-2"
                      shape="circle"
                      icon={<ArrowLeftOutlined />}
                    />
                  </Link>

                  <Title level={3}>Task List</Title>
                </div>
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
          </Col>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: TOTAL_SPAN }}
            lg={{ span: TOTAL_SPAN }}
            xl={{ span: TOTAL_SPAN }}
            xxl={{ span: TOTAL_SPAN }}
          >
            <HeaderCards />
          </Col>
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
                {" "}
                <TasksTable />
                {/* <ModuleCardsList /> */}
              </Col>
            </Row>
          </Col>
        </Row>
      </Suspense>
    </div>
  );
}

export default TasksList;
