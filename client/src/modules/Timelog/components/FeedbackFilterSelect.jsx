import { Col, Row, TreeSelect } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilterDataOptions } from "../models/TimelogModel";
import { TimelogController } from "../controllers";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
const { SHOW_PARENT } = TreeSelect;
const FULL_SPAN = 24;

const FeedbackFilterSelect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const user_id = useSelector((state) => state.login.user.id);
  const filterDate = useSelector((state) => state.timelog.filterDate);
  const filterDataOptions = useSelector(
    (state) => state.timelog.filterDataOptions
  );

  const QUERY_KEY_FILTER_TIMELOG_TREE = [
    "timelog_filter_tree",
    organization_id,
    user_id,
    filterDate,
  ];
  const { handleGetUserTreeData } = TimelogController({
    dispatch,
    queryClient,
    navigate,
  });

  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEY_FILTER_TIMELOG_TREE,
    queryFn: () => handleGetUserTreeData(organization_id, user_id, filterDate),
    retry: false,
    enabled: !!organization_id || !!user_id,
    staleTime: Infinity,
    keepPreviousData: true,
  });
  const treeData = [
    {
      title: "All",
      value: "All",
      key: "All",
      children: data,
    },
  ];

  const onChange = (newValue) => {
    dispatch(setFilterDataOptions(newValue));
  };

  const tProps = {
    treeData,
    allowClear: true,
    value: filterDataOptions,
    treeDefaultExpandedKeys: [
      "All",
      treeData[0].children?.map((child) => child.key),
    ],
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
export default FeedbackFilterSelect;
