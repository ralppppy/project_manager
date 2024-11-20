import { Form, Col, Select } from "antd";
import React from "react";

import { useQuery } from "react-query";

import { useSelector } from "react-redux";
import HolidayController from "../controllers/HolidayController";

const TOTAL_SPAN = 24;

const { Option } = Select;

function HolidayTypeDropdown() {
  const { handleGetHolidayTypeDropdown } = HolidayController({});

  const user = useSelector((state) => state.login.user);

  const QUERY_KEY_HOLIDAY_TYPE_DROPDOWN = [
    "holiday_type_dropdown",
    user.organization_id,
  ];
  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEY_HOLIDAY_TYPE_DROPDOWN,
    queryFn: () => handleGetHolidayTypeDropdown(user.organization_id),
    enabled: !!user.organization_id,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    keepPreviousData: true,
  });

  return (
    <Form.Item
      label="Holiday Type"
      name="holiday_type_id"
      rules={[
        {
          required: true,
          message: "Holiday Type is required!",
        },
      ]}
    >
      <Select showSearch allowClear>
        {data?.map((holidayType) => (
          <Option key={holidayType.id} value={holidayType.id}>
            {holidayType.name}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
}

export default React.memo(HolidayTypeDropdown);
