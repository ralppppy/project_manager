import { Avatar, Card, Col, List, Row, Tabs, Typography } from "antd";
import React, { Suspense } from "react";
import "./styles.css";
import FilterClientProjectModule from "../../Common/components/FilterClientProjectModule";
import { TasksTable } from "../../TasksList/components";
import TasksListModalForm from "../../TasksList/components/TasksListModalForm";

const { Title } = Typography;

const TOTAL_SPAN = 24;

function UserProjects() {
  const onChange = (key) => {
    console.log(key);
  };

  const data = [
    {
      title: "Ant Design Title 1",
    },
    {
      title: "Ant Design Title 2",
    },
    {
      title: "Ant Design Title 3",
    },
    {
      title: "Ant Design Title 4",
    },
  ];
  const items = [
    {
      key: "1",
      label: "Timelogs",
      children: (
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item, index) => (
            <Card>
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                    />
                  }
                  title={<a href="https://ant.design">{item.title}</a>}
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                />
              </List.Item>
            </Card>
          )}
        />
      ),
    },
    {
      key: "2",
      label: "Tab 2",
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "Tab 3",
      children: "Content of Tab Pane 3",
    },
  ];
  return (
    <>
      <Suspense fallback={<></>}>
        {/* <Row gutter={[10, 10]}>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: TOTAL_SPAN }}
            lg={{ span: TOTAL_SPAN }}
            xl={{ span: TOTAL_SPAN }}
            xxl={{ span: TOTAL_SPAN }}
            className="d-flex align-items-center justify-content-end"
          >
            <FilterClientProjectModule queryKey="dashboard_filter_key" />
          </Col>
        </Row> */}
        <Row gutter={[10, 10]}>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: 4 }}
            lg={{ span: 4 }}
            xl={{ span: 4 }}
            xxl={{ span: 4 }}
          >
            <Title level={3}>Task Tracker</Title>
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
            <FilterClientProjectModule queryKey="dashboard_filter_key" />
          </Col>
        </Row>

        <TasksTable isDashboard={true} />

        <Suspense fallback={<></>}>
          <TasksListModalForm
            isDashboard={true}
            queryKey="dashboard_filter_key"
          />{" "}
        </Suspense>
      </Suspense>
    </>
  );
}

export default UserProjects;
