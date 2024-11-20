import React, { useState } from "react";

import { Col, Row, Select } from "antd";
import { DatePicker } from "antd";

import data from "./data.json";
import TimelogSearchInput from "./TimelogSearchInput";
import FeedbackStatusSelect from "./FeedbackStatusSelect";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "react-query";
import { TimelogController } from "../controllers";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
const FULL_SPAN = 24;

const CLIENTS = [];
const PROJECTS = [];
data.forEach((c) => {
  CLIENTS.push({ value: c.clients, label: c.clients });
  PROJECTS.push({ value: c.proj_name, label: c.proj_name });
});

const FilterOptions = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const filterDate = useSelector((state) => state.timelog.filterDate);
  const { handleChangeDateFilter } = TimelogController({
    dispatch,
    queryClient,
  });

  return (
    <>
      <Row className="mb-2">
        <Col
          xs={{ span: FULL_SPAN }}
          sm={{ span: FULL_SPAN }}
          md={{ span: FULL_SPAN }}
          lg={{ span: FULL_SPAN }}
          xl={{ span: FULL_SPAN }}
          xxl={{ span: FULL_SPAN }}
        >
          <TimelogSearchInput />
        </Col>
      </Row>
      <Row className="mb-2">
        <Col
          xs={{ span: FULL_SPAN }}
          sm={{ span: FULL_SPAN }}
          md={{ span: FULL_SPAN }}
          lg={{ span: FULL_SPAN }}
          xl={{ span: FULL_SPAN }}
          xxl={{ span: FULL_SPAN }}
        >
          <RangePicker
            defaultValue={
              filterDate.start
                ? [dayjs.utc(filterDate.start), dayjs.utc(filterDate.end)]
                : [dayjs.utc().startOf("month"), dayjs.utc().endOf("month")]
            }
            onChange={(value) => handleChangeDateFilter(value)}
          />
        </Col>
      </Row>
      <Row className="mb-2">
        <Col
          xs={{ span: FULL_SPAN }}
          sm={{ span: FULL_SPAN }}
          md={{ span: FULL_SPAN }}
          lg={{ span: FULL_SPAN }}
          xl={{ span: FULL_SPAN }}
          xxl={{ span: FULL_SPAN }}
        >
          <FeedbackStatusSelect />
        </Col>
      </Row>
    </>
  );
};

export default FilterOptions;
