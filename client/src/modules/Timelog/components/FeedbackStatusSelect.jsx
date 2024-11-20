import { Col, Row, Select, TreeSelect } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilterStatusOptions } from "../models/TimelogModel";
import { TimelogController } from "../controllers";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
const { SHOW_PARENT } = TreeSelect;
const FULL_SPAN = 24;

const FeedbackStatusSelect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );
  const filterStatusOptions = useSelector(
    (state) => state.timelog.filterStatusOptions
  );
  const QUERY_KEY_TASK_STATUS = ["tasks_status_dropdown", organization_id];

  const { handleGetStatusSelectData } = TimelogController({
    dispatch,
    queryClient,
    navigate,
  });

  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEY_TASK_STATUS,
    queryFn: () => handleGetStatusSelectData(organization_id),
    enabled: !!organization_id,
    staleTime: Infinity,
  });
  const treeData = [
    {
      id: "All",
      title: "All",
      value: "All",
      key: "All",
      children: data,
    },
  ];
  const onChange = (newValue) => {
    dispatch(setFilterStatusOptions(newValue));
  };

  const tProps = {
    treeData,
    allowClear: true,
    value: filterStatusOptions,
    treeDefaultExpandAll: true,
    onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: "Status",
    style: {
      width: "100%",
    },
  };

  return <TreeSelect {...tProps} />;
};
export default FeedbackStatusSelect;
