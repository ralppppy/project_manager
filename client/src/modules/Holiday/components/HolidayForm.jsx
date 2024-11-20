import { Button, Col, DatePicker, Descriptions, Form, Input, Row } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import HolidayTypeDropdown from "./HolidayTypeDropdown";

const { RangePicker } = DatePicker;
const TOTAL_SPAN = 24;

const { TextArea } = Input;
function HolidayForm({ form }) {
  const isUpdate = useSelector((state) => state.holiday.isUpdate);

  return (
    <>
      <Row gutter={[10, 0]}>
        <Form.Item hidden name="id">
          <Input />
        </Form.Item>
        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: 8 }}
          lg={{ span: 8 }}
          xl={{ span: 8 }}
          xxl={{ span: 8 }}
        >
          <Form.Item
            label="Holiday ID"
            name="holiday_id_text"
            rules={[
              {
                required: true,
                message: "ID is required!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: 16 }}
          lg={{ span: 16 }}
          xl={{ span: 16 }}
          xxl={{ span: 16 }}
        >
          <HolidayTypeDropdown />
        </Col>

        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: TOTAL_SPAN }}
          lg={{ span: TOTAL_SPAN }}
          xl={{ span: TOTAL_SPAN }}
          xxl={{ span: TOTAL_SPAN }}
        >
          <Form.Item
            label="Instruction"
            name="instruction"
            rules={[
              {
                required: true,
                message: "Instruction is required",
              },
            ]}
          >
            <TextArea rows={4} maxLength={6} />
          </Form.Item>
        </Col>

        {/* <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: TOTAL_SPAN }}
          lg={{ span: TOTAL_SPAN }}
          xl={{ span: TOTAL_SPAN }}
          xxl={{ span: TOTAL_SPAN }}
        >
          <Form.Item
            label="Holiday Date"
            name="holiday_date"
            rules={[
              {
                required: true,
                message: "Date is required",
              },
            ]}
          >
            <RangePicker className="w-100" />
          </Form.Item>
        </Col> */}

        {/* <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: TOTAL_SPAN }}
          lg={{ span: TOTAL_SPAN }}
          xl={{ span: TOTAL_SPAN }}
          xxl={{ span: TOTAL_SPAN }}
        >
          <Form.Item
            label="Assigned To"
            name="team"
            rules={[
              {
                required: true,
                message: "User is required",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col> */}
      </Row>

      <Form.Item>
        <Button className="w-100" type="primary" htmlType="submit">
          {isUpdate ? "Update" : "Submit"}
        </Button>
      </Form.Item>
    </>
  );
}

export default HolidayForm;
