import React, { useEffect } from "react";
import { Col, Row, Tag } from "antd";
import style from "./styles.module.css";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { ProjectController } from "../../Project/controllers";

const TOTAL_SPAN = 24;
function ProjectDetails() {
  const dispatch = useDispatch();

  const { handleGetProjectDetails } = ProjectController({ dispatch });
  const QUERY_KEY = ["project_details"];
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );
  const { data } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => handleGetProjectDetails(organization_id),
    enabled: !!organization_id,
    staleTime: Infinity,
  });

  return (
    <Row gutter={[6, 6]} className="w-100">
      <Col
        xs={{ span: TOTAL_SPAN }}
        sm={{ span: TOTAL_SPAN }}
        md={{ span: TOTAL_SPAN / 3 }}
        lg={{ span: TOTAL_SPAN / 3 }}
        xl={{ span: TOTAL_SPAN / 3 }}
        xxl={{ span: TOTAL_SPAN / 3 }}
      >
        <Tag className={style.tagStyle} color="#17a2b8">
          Total Projects: {data?.totalProjects}
        </Tag>
      </Col>
      <Col
        xs={{ span: TOTAL_SPAN }}
        sm={{ span: TOTAL_SPAN }}
        md={{ span: TOTAL_SPAN / 3 }}
        lg={{ span: TOTAL_SPAN / 3 }}
        xl={{ span: TOTAL_SPAN / 3 }}
        xxl={{ span: TOTAL_SPAN / 3 }}
      >
        <Tag className={style.tagStyle} color="#007bff">
          Open Projects: {data?.activeProjects}
        </Tag>
      </Col>
      <Col
        xs={{ span: TOTAL_SPAN }}
        sm={{ span: TOTAL_SPAN }}
        md={{ span: TOTAL_SPAN / 3 }}
        lg={{ span: TOTAL_SPAN / 3 }}
        xl={{ span: TOTAL_SPAN / 3 }}
        xxl={{ span: TOTAL_SPAN / 3 }}
      >
        <Tag className={style.tagStyle} color="#6c757d">
          Closed Projects: {data?.inactiveProjects}
        </Tag>
      </Col>
    </Row>
  );
}

export default React.memo(ProjectDetails);
