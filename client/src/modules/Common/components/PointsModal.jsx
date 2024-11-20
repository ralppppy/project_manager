import {
  Avatar,
  Col,
  Modal,
  Row,
  Space,
  Tag,
  Typography,
  Tooltip,
  Upload,
  Tabs,
} from "antd";

import React, { useState } from "react";
import {
  HistoryOutlined,
  UserOutlined,
  AntDesignOutlined,
  EditOutlined,
  PlusOutlined,
  ClockCircleFilled,
} from "@ant-design/icons";
import CommentList from "./CommentList";

const TOTAL_SPAN = 24;

const { Text, Paragraph } = Typography;
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function PointsModal({ data, open, onOk, onCancel }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-2",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-3",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-4",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-xxx",
      percent: 50,
      name: "image.png",
      status: "uploading",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-5",
      name: "image.png",
      status: "error",
    },
  ]);

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  return (
    <>
      <Modal
        title={`Point #: ${data.key}`}
        open={open}
        className="w-50"
        onOk={onOk}
        footer={null}
        onCancel={onCancel}
      >
        <Row className="mt-3" gutter={[10, 10]}>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: 15 }}
            lg={{ span: 15 }}
            xl={{ span: 15 }}
            xxl={{ span: 15 }}
          >
            <Row gutter={[10, 10]}>
              <Col
                xs={{ span: TOTAL_SPAN }}
                sm={{ span: TOTAL_SPAN }}
                md={{ span: TOTAL_SPAN / 2 }}
                lg={{ span: TOTAL_SPAN / 2 }}
                xl={{ span: TOTAL_SPAN / 2 }}
                xxl={{ span: TOTAL_SPAN / 2 }}
              >
                <Space size="small" direction="vertical">
                  <Text>
                    Feedback Title: <Text strong>Mobile Application</Text>
                  </Text>
                  <Text>
                    Client: <Text strong>praxisplan GmbH</Text>
                  </Text>
                  <Text>
                    Project:{" "}
                    <Text strong>Zeiterfassung / Mitarbeiterplanung</Text>
                  </Text>
                  <Text>
                    Project Role: <Text strong>Project Staff</Text>
                  </Text>
                </Space>
              </Col>
              <Col
                xs={{ span: TOTAL_SPAN }}
                sm={{ span: TOTAL_SPAN }}
                md={{ span: TOTAL_SPAN / 2 }}
                lg={{ span: TOTAL_SPAN / 2 }}
                xl={{ span: TOTAL_SPAN / 2 }}
                xxl={{ span: TOTAL_SPAN / 2 }}
              >
                <Space size="small" direction="vertical">
                  <Text>
                    Date Created: <Text strong> 36 minutes ago</Text>
                  </Text>
                  <Text>
                    Version: <Text strong>V1.0</Text>
                  </Text>

                  <Text>
                    Created By: <Text strong>Alvera Principe</Text>
                  </Text>
                </Space>
              </Col>
              <Col
                xs={{ span: TOTAL_SPAN }}
                sm={{ span: TOTAL_SPAN }}
                md={{ span: TOTAL_SPAN }}
                lg={{ span: TOTAL_SPAN }}
                xl={{ span: TOTAL_SPAN }}
                xxl={{ span: TOTAL_SPAN }}
              >
                <Text strong>Instruction: </Text>
                <Paragraph editable copyable={true}>
                  Mobile Application || QA Test Result || Multiple deletions
                  show the same text as a single deletion in the mobile app
                  Image 1: Notification on the Web Tool when multiple deletions
                  are used when deleting multiple approved applications
                </Paragraph>
              </Col>
              <Col
                xs={{ span: TOTAL_SPAN }}
                sm={{ span: TOTAL_SPAN }}
                md={{ span: TOTAL_SPAN }}
                lg={{ span: TOTAL_SPAN }}
                xl={{ span: TOTAL_SPAN }}
                xxl={{ span: TOTAL_SPAN }}
              >
                <Tabs
                  defaultActiveKey="1"
                  centered
                  items={[
                    {
                      label: `General Comments`,
                      key: 1,
                      children: <CommentList />,
                    },
                    {
                      label: `Internal Comments`,
                      key: 2,
                      children: <CommentList />,
                    },
                  ]}
                />
              </Col>
            </Row>
          </Col>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: 9 }}
            lg={{ span: 9 }}
            xl={{ span: 9 }}
            xxl={{ span: 9 }}
          >
            <Row gutter={[10, 10]}>
              <Col
                xs={{ span: TOTAL_SPAN }}
                sm={{ span: TOTAL_SPAN }}
                md={{ span: TOTAL_SPAN / 2 }}
                lg={{ span: TOTAL_SPAN / 2 }}
                xl={{ span: TOTAL_SPAN / 2 }}
                xxl={{ span: TOTAL_SPAN / 2 }}
              >
                <Space size="middle" direction="vertical">
                  <Space size={5} direction="vertical">
                    <Text>
                      Status{" "}
                      <EditOutlined
                        style={{ fontSize: 13, cursor: "pointer" }}
                      />
                    </Text>
                    <Tag color="red">Open</Tag>
                  </Space>

                  <Space size={5} direction="vertical">
                    <Text>Deadline</Text>
                    <Text strong>N/A</Text>
                  </Space>
                  <Space size={5} direction="vertical">
                    <Text>Priority</Text>
                    <Tag color="warning">Low</Tag>
                  </Space>
                </Space>
              </Col>
              <Col
                xs={{ span: TOTAL_SPAN }}
                sm={{ span: TOTAL_SPAN }}
                md={{ span: TOTAL_SPAN / 2 }}
                lg={{ span: TOTAL_SPAN / 2 }}
                xl={{ span: TOTAL_SPAN / 2 }}
                xxl={{ span: TOTAL_SPAN / 2 }}
              >
                <Space size="middle" direction="vertical">
                  <Space size={5} direction="vertical">
                    <Text>Hours Worked</Text>
                    <Text strong>
                      00:00 <HistoryOutlined />
                    </Text>
                  </Space>

                  <Space size={5} direction="vertical">
                    <Text>Time Estimate</Text>
                    <Text strong>
                      08:24 <ClockCircleFilled style={{ color: "orange" }} />{" "}
                    </Text>
                  </Space>
                  <Space size={5} direction="vertical">
                    <Text>
                      Last Change <HistoryOutlined />
                    </Text>
                    <Text type="secondary">
                      Ralp Yosores <br /> <Text>Changed assigned user</Text>
                    </Text>
                  </Space>
                </Space>
              </Col>
              <Col
                xs={{ span: TOTAL_SPAN }}
                sm={{ span: TOTAL_SPAN }}
                md={{ span: TOTAL_SPAN }}
                lg={{ span: TOTAL_SPAN }}
                xl={{ span: TOTAL_SPAN }}
                xxl={{ span: TOTAL_SPAN }}
              >
                <Space size={5} direction="vertical">
                  <Text>
                    Assigned User{" "}
                    <EditOutlined style={{ fontSize: 13, cursor: "pointer" }} />
                  </Text>

                  <Avatar.Group>
                    <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
                    <Tooltip title="Ralp Yosores" placement="top">
                      <Avatar
                        style={{
                          backgroundColor: "#f56a00",
                          cursor: "pointer",
                        }}
                      >
                        R.Y
                      </Avatar>
                    </Tooltip>
                    <Tooltip title="Ant User" placement="top">
                      <Avatar
                        style={{ backgroundColor: "#87d068" }}
                        icon={<UserOutlined />}
                      />
                    </Tooltip>
                    <Tooltip title="Ant User" placement="top">
                      <Avatar
                        style={{ backgroundColor: "#87d068" }}
                        icon={<UserOutlined />}
                      />
                    </Tooltip>

                    <Avatar
                      style={{ backgroundColor: "#1677ff" }}
                      icon={<AntDesignOutlined />}
                    />
                  </Avatar.Group>
                </Space>
              </Col>
              <Col
                xs={{ span: TOTAL_SPAN }}
                sm={{ span: TOTAL_SPAN }}
                md={{ span: TOTAL_SPAN }}
                lg={{ span: TOTAL_SPAN }}
                xl={{ span: TOTAL_SPAN }}
                xxl={{ span: TOTAL_SPAN }}
              >
                <Space direction="vertical">
                  <Text>Attachments</Text>

                  <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                  >
                    <div>
                      <PlusOutlined />
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        Upload
                      </div>
                    </div>
                  </Upload>
                  <Modal
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleCancel}
                  >
                    <img
                      alt="example"
                      style={{
                        width: "100%",
                      }}
                      src={previewImage}
                    />
                  </Modal>
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
    </>
  );
}

export default PointsModal;
