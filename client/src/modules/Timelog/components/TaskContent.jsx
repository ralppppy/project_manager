import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Popover,
  Row,
  TimePicker,
  Typography,
  message,
} from "antd";
import React, { useEffect } from "react";
import dayjs from "dayjs";
import { DeleteOutlined } from "@ant-design/icons";
import { TimelogController } from "../controllers";
import { useDispatch, useSelector } from "react-redux";
const { Text } = Typography;

const TaskContent = ({ info }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const user_id = useSelector((state) => state.login.user.id);
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const { handleDeleteTimelog, handleUpdateTimelog, getContrast } =
    TimelogController({
      dispatch,
      form,
      messageApi,
    });

  useEffect(() => {
    form.setFieldsValue({
      timelog_update_start: dayjs.utc(info.event.startStr),
      timelog_update_end: dayjs.utc(info.event.endStr),
    });
  }, [info]);

  return (
    <Popover
      trigger={"click"}
      content={
        <Form
          className="mt-2"
          layout="vertical"
          onFinish={(values) => handleUpdateTimelog(info, values)}
          form={form}
          preserve={false}
          autoComplete="off"
          initialValues={{
            timelog_update_start: dayjs.utc(info.event.startStr),
            timelog_update_end: dayjs.utc(info.event.endStr),
            timelog_update_id: info.event.id,
          }}
        >
          {contextHolder}
          <>
            <Form.Item name="timelog_update_id" hidden>
              <Input />
            </Form.Item>
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
                <Form.Item label="Start" name="timelog_update_start">
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
                <Form.Item label="End" name="timelog_update_end">
                  <TimePicker format="hh:mm a" className="w-100" />
                </Form.Item>
              </Col>
            </Row>
            <Row className="w-100">
              <Form.Item className="w-100">
                <Button className="w-100" type="primary" htmlType="submit">
                  Update
                </Button>
              </Form.Item>
            </Row>
          </>
        </Form>
      }
      title={
        <Row>
          <Col md={{ span: 20 }}>
            <Text>{info.event.title}</Text>
          </Col>
          <Col className="d-flex w-100 justify-content-end " md={{ span: 4 }}>
            <Popconfirm
              onConfirm={() => handleDeleteTimelog(info, organization_id)}
              title={"Are you sure?"}
              okText={"Yes"}
              cancelText={"No"}
            >
              <Button
                className="shadow-sm"
                type="primary"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Col>
        </Row>
      }
    >
      <div className="fc-event-main-frame">
        <div className="fc-event-title-container">
          <div className="fc-event-title fc-sticky" style={{ top: 0 }}>
            {info.event.title}
            {/* <Text
              style={{
                paddingLeft: 4,
                paddingRight: 2,
                color: getContrast(info.backgroundColor),
              }}
              ellipsis={true}
            >
              
            </Text> */}
          </div>
        </div>
      </div>
    </Popover>
  );
};

export default TaskContent;
