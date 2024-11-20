import { Col, Row, Switch } from "antd";
import React from "react";
import { ProjectController } from "../controllers";
import { useDispatch, useSelector } from "react-redux";

const TOTAL_SPAN = 24;
function SwitchesFilter() {
  const dispatch = useDispatch();

  const { handleFilter } = ProjectController({ dispatch });
  const filter = useSelector((state) => state.project.filter);

  return (
    <Row gutter={[10, 10]}>
      <Col
        xs={{ span: TOTAL_SPAN }}
        sm={{ span: TOTAL_SPAN }}
        md={{ span: TOTAL_SPAN / 2 }}
        lg={{ span: TOTAL_SPAN / 2 }}
        xl={{ span: TOTAL_SPAN / 2 }}
        xxl={{ span: TOTAL_SPAN / 2 }}
      >
        <Switch
          className="w-100"
          checkedChildren="Assigned Projects"
          unCheckedChildren="All Projects"
          checked={filter.assignedProjects}
          onChange={(value) => handleFilter("assignedProjects", value)}
        />
      </Col>
      <Col
        xs={{ span: TOTAL_SPAN }}
        sm={{ span: TOTAL_SPAN }}
        md={{ span: TOTAL_SPAN / 2 }}
        lg={{ span: TOTAL_SPAN / 2 }}
        xl={{ span: TOTAL_SPAN / 2 }}
        xxl={{ span: TOTAL_SPAN / 2 }}
      >
        <Switch
          className="w-100"
          checkedChildren="Hide Closed Projects"
          unCheckedChildren="Show Closed Projects"
          checked={filter.active}
          onChange={(value) => handleFilter("active", value)}
        />
      </Col>
    </Row>
  );
}

export default SwitchesFilter;
