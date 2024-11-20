import { Button, Col, DatePicker, Form, Row, TimePicker, message } from "antd";
import React from "react";
import dayjs from "dayjs";
import { TimelogController } from "../controllers";
import { useDispatch, useSelector } from "react-redux";

const AddTaskPopover = ({ task, calendar }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const user_id = useSelector((state) => state.login.user.id);

  const { handleAddTimelog } = TimelogController({
    dispatch,
    form,
    calendar,
    messageApi,
  });

  return (
    <Form
      className="mt-3"
      layout="vertical"
      name={task.id}
      onFinish={(values) => handleAddTimelog({ values, task, user_id })}
      form={form}
      preserve={false}
      autoComplete="off"
      initialValues={{
        timelog_date: dayjs.utc().startOf("day"),
      }}
    >
      {contextHolder}
      <>
        <Row className="w-100">
          <Form.Item className="w-100" label="Date" name="timelog_date">
            <DatePicker className="w-100" />
          </Form.Item>
        </Row>
        <Row className="w-100">
          <Col
            className="mr-2"
            xs={{ span: 11 }}
            sm={{ span: 11 }}
            md={{ span: 11 }}
            lg={{ span: 11 }}
            xl={{ span: 11 }}
            xxl={{ span: 11 }}
          >
            <Form.Item label="Start" name="timelog_start">
              <TimePicker format="hh:mm a" className="w-100" />
            </Form.Item>
          </Col>
          <Col
            xs={{ span: 12 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            xl={{ span: 12 }}
            xxl={{ span: 12 }}
          >
            <Form.Item label="End" name="timelog_end">
              <TimePicker format="hh:mm a" className="w-100" />
            </Form.Item>
          </Col>
        </Row>
        <Row className="w-100">
          <Form.Item className="w-100">
            <Button className="w-100" type="primary" htmlType="submit">
              Add Timelog
            </Button>
          </Form.Item>
        </Row>
      </>
    </Form>
  );
};

export default AddTaskPopover;
