import { Col, Row, Typography } from "antd";
import React, { Suspense } from "react";
import "./styles.css";
import {
  LanguageAndRegion,
  PlatformSettings,
  ProfileHeader,
  ProfileInformation,
  UserProjects,
} from "../components";

const TOTAL_SPAN = 24;
const { Title } = Typography;

function Profile() {
  return (
    <Suspense fallback={<></>}>
      <Title level={3}>Profile</Title>

      <Row gutter={[10, 30]}>
        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: TOTAL_SPAN }}
          lg={{ span: TOTAL_SPAN }}
          xl={{ span: TOTAL_SPAN }}
          xxl={{ span: TOTAL_SPAN }}
        >
          <ProfileHeader />
        </Col>
        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: TOTAL_SPAN / 2 }}
          lg={{ span: TOTAL_SPAN / 2 }}
          xl={{ span: TOTAL_SPAN / 2 }}
          xxl={{ span: TOTAL_SPAN / 2 }}
        >
          <PlatformSettings />
        </Col>
        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: TOTAL_SPAN / 2 }}
          lg={{ span: TOTAL_SPAN / 2 }}
          xl={{ span: TOTAL_SPAN / 2 }}
          xxl={{ span: TOTAL_SPAN / 2 }}
        >
          <ProfileInformation />
        </Col>
        {/* <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: TOTAL_SPAN / 3 }}
          lg={{ span: TOTAL_SPAN / 3 }}
          xl={{ span: TOTAL_SPAN / 3 }}
          xxl={{ span: TOTAL_SPAN / 3 }}
        >
          <LanguageAndRegion />
        </Col> */}

        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: TOTAL_SPAN }}
          lg={{ span: TOTAL_SPAN }}
          xl={{ span: TOTAL_SPAN }}
          xxl={{ span: TOTAL_SPAN }}
        >
          <UserProjects />
        </Col>
      </Row>
    </Suspense>
  );
}

export default Profile;
