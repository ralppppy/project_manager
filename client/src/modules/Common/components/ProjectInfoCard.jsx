import {
  Card,
  Typography,
  Space,
  Progress,
  Col,
  Row,
  Button,
  theme,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import React from "react";

import "./styles.css";
import { Developers } from ".";
import dayjs from "dayjs";
import ModuleListController from "@modules/ModuleList/controllers/ModuleListController";
import { useDispatch, useSelector } from "react-redux";

const { Paragraph, Text } = Typography;
const TOTAL_SPAN = 24;

function ProjectInfoCard({ item, footer }) {
  const dispatch = useDispatch();
  const { handleShowUpdateModal } = ModuleListController({ dispatch });
  const { token } = theme.useToken();
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  let progressPercent = parseInt(
    (item?.completed_tasks / item?.total_tasks) * 100
  );

  return (
    <Card
      hoverable
      title={
        <div className="d-flex justify-content-between w-100">
          <Space className="mt-2" size={0} direction="vertical">
            <Text style={{ fontSize: 14 }}>{item.title}</Text>
            <Text style={{ fontSize: 11 }} type="secondary">
              {item.subTitle}
            </Text>
          </Space>

          <Button
            onClick={(e) => {
              e.preventDefault();
              handleShowUpdateModal(item, organization_id);
            }}
            icon={<EditOutlined style={{ color: token.colorText }} />}
            className="mt-2 module-edit-button"
            type="link"
          />
        </div>
      }
    >
      <Row>
        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: TOTAL_SPAN }}
          lg={{ span: TOTAL_SPAN }}
          xl={{ span: TOTAL_SPAN }}
          xxl={{ span: TOTAL_SPAN }}
          //   style={{
          //     height: window.innerHeight * 0.08,
          //   }}
        >
          <div className="multi-line-paragraph">
            <Paragraph ellipsis={{ rows: 2 }} strong>
              {item.description}
            </Paragraph>
          </div>
        </Col>
        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: TOTAL_SPAN }}
          lg={{ span: TOTAL_SPAN }}
          xl={{ span: TOTAL_SPAN }}
          xxl={{ span: TOTAL_SPAN }}
        >
          <Space className="w-100" size={0} direction="vertical">
            <Text style={{ fontSize: 11 }} type="secondary">
              Task completed:{" "}
              <Space align="center">
                <Text style={{ fontSize: 11 }}>
                  {item?.completed_tasks} / {item?.total_tasks}
                </Text>
              </Space>
            </Text>
            <Progress
              percent={progressPercent}
              status={progressPercent === 100 ? "success" : "active"}
            />{" "}
          </Space>
        </Col>
        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: TOTAL_SPAN }}
          lg={{ span: TOTAL_SPAN }}
          xl={{ span: TOTAL_SPAN }}
          xxl={{ span: TOTAL_SPAN }}
          className="mt-2"
        >
          <Row>
            <Col
              xs={{ span: TOTAL_SPAN / 2 }}
              sm={{ span: TOTAL_SPAN / 2 }}
              md={{ span: TOTAL_SPAN / 2 }}
              lg={{ span: TOTAL_SPAN / 2 }}
              xl={{ span: TOTAL_SPAN / 2 }}
              xxl={{ span: TOTAL_SPAN / 2 }}
            >
              <Space className="w-100" size={0} direction="vertical">
                <Text style={{ fontSize: 11 }} type="secondary">
                  Date Started
                </Text>
                <Text style={{ fontSize: 11 }}>
                  {dayjs.utc(item.date_started).format("DD MMMM, YYYY")}
                </Text>
              </Space>
            </Col>
            <Col
              xs={{ span: TOTAL_SPAN / 2 }}
              sm={{ span: TOTAL_SPAN / 2 }}
              md={{ span: TOTAL_SPAN / 2 }}
              lg={{ span: TOTAL_SPAN / 2 }}
              xl={{ span: TOTAL_SPAN / 2 }}
              xxl={{ span: TOTAL_SPAN / 2 }}
              className="d-flex justify-content-end align-items-center"
            >
              <Developers users={item.developers} />
            </Col>
          </Row>
        </Col>
      </Row>

      {footer && footer(item)}
    </Card>
  );
}

export default ProjectInfoCard;
