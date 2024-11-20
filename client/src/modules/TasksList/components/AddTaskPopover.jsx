import { Button, Col, DatePicker, Form, Row, TimePicker, message } from "antd";
import React, { useRef } from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { TaskListController } from "../controllers";
import { useQueryClient } from "react-query";

const AddTaskPopover = ({ task, messageApi, setOpen }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login.user);

  const queryClient = useQueryClient();

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const { handleAddTimelog } = TaskListController({
    dispatch,
    queryClient,
    messageApi,
    setOpen,
  });
  const timelogEndRef = useRef(null);

  return (
    <>
      <Form
        className="mt-3"
        layout="vertical"
        name={task.id}
        onFinish={(values) => {
          handleAddTimelog({ values, user, task, organization_id, form });
        }}
        form={form}
        preserve={false}
        autoComplete="off"
        initialValues={{
          timelog_date: dayjs.utc().startOf("day"),
        }}
      >
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
                <TimePicker
                  changeOnBlur
                  onBlur={() => {
                    // logic for handling the onBlur event
                    if (timelogEndRef.current) {
                      timelogEndRef.current.focus();
                    }
                  }}
                  onOk={() => {
                    // logic for handling the onBlur event
                    if (timelogEndRef.current) {
                      timelogEndRef.current.focus();
                    }
                  }}
                  format="hh:mm a"
                  className="w-100"
                />
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
                <TimePicker
                  ref={timelogEndRef}
                  changeOnBlur
                  format="hh:mm a"
                  className="w-100"
                />
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
      </Form>{" "}
    </>
  );
};

export default AddTaskPopover;
