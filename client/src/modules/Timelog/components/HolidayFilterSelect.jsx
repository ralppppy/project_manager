import { Col, Row, TreeSelect } from "antd";
import React, { useState } from "react";
const { SHOW_PARENT } = TreeSelect;
const FULL_SPAN = 24;
const treeData = [
  {
    title: "All",
    value: "a0",
    key: "a0",
    children: [
      {
        title: "Public Holiday",
        key: "a1",
        value: "a1",
        children: [
          {
            title: "January",
            key: "a2",
            value: "a2",
          },
          {
            title: "February",
            key: "a5",
            value: "a5",
          },
        ],
      },
      {
        title: "Holiday Leave",
        key: "a8",
        value: "a8",
        children: [
          {
            title: "January",
            key: "a9",
            value: "a9",
          },
          {
            title: "February",
            key: "a12",
            value: "a12",
          },
        ],
      },
      {
        title: "Sick Leave",
        key: "a15",
        value: "a15",
        children: [
          {
            title: "January",
            key: "a16",
            value: "a16",
          },
          {
            title: "February",
            key: "a19",
            value: "a19",
          },
        ],
      },
    ],
  },
];

const HolidayFilterSelect = () => {
  const [value, setValue] = useState(["a0"]);
  const onChange = (newValue) => {
    console.log("onChange ", value);
    setValue(newValue);
  };
  const tProps = {
    treeData,
    allowClear: true,
    value,
    onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,

    placeholder: "Filter",
    style: {
      width: "100%",
    },
  };
  return (
    <Row className="mb-2">
      <Col
        xs={{ span: FULL_SPAN }}
        sm={{ span: FULL_SPAN }}
        md={{ span: FULL_SPAN }}
        lg={{ span: FULL_SPAN }}
        xl={{ span: FULL_SPAN }}
        xxl={{ span: FULL_SPAN }}
      >
        <TreeSelect {...tProps} />
      </Col>
    </Row>
  );
};
export default HolidayFilterSelect;
