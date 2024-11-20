import React from "react";
import { Button, Col, Row } from "antd";

import { PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import UserManagementController from "../controllers/UserManagementController";
import { UserModalForm } from ".";
// import { ClientController } from "../controllers";
// import { ClientModalForm } from ".";

const TOTAL_SPAN = 24;

function TableHeader({ QUERY_KEY }) {
  const dispatch = useDispatch();
  const { handleModalOpen, handleChangeIsUpdateState } =
    UserManagementController({ dispatch });
  return (
    <>
      <Row gutter={[10, 10]}>
        <Col
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: 4 }}
          lg={{ span: 4 }}
          xl={{ span: 3 }}
          xxl={{ span: 2 }}
          className="text-center"
        >
          <Button
            onClick={() => {
              handleChangeIsUpdateState(false);

              handleModalOpen(true);
            }}
            className="w-100"
            icon={<PlusOutlined />}
            type="primary"
          >
            Add User
          </Button>
        </Col>
      </Row>
      <UserModalForm QUERY_KEY={QUERY_KEY} />
    </>
  );
}

export default React.memo(TableHeader);
