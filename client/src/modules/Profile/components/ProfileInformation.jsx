import { Card, Descriptions } from "antd";
import React, { Suspense, useEffect, useRef } from "react";
import { ProfileController } from "../controllers";
import { useDispatch, useSelector } from "react-redux";
import { EditOutlined } from "@ant-design/icons";
import { ProfileInformationModal } from ".";

const OTHER_INFO = {
  true: "employee",
  false: "client",
};

function ProfileInformation() {
  const cardRef = useRef();
  const {
    first_name,
    last_name,
    email,
    is_employee,
    phone_number,
    street_nr,
    city,
    zip_code,
    country,
    id,
  } = useSelector((state) => state.login.user);
  const dispatch = useDispatch();

  const { handleSetHeight, handleOpenProfileModalOpen } = ProfileController({
    dispatch,
  });

  useEffect(() => {
    handleSetHeight(cardRef.current.clientHeight);
  }, [cardRef.current]);

  return (
    <Card ref={cardRef}>
      <EditOutlined
        onClick={() => {
          handleOpenProfileModalOpen(true);
        }}
        style={{ position: "absolute", top: 15, right: 15, cursor: "pointer" }}
      />
      <Descriptions title="Profile Information" layout="vertical">
        <Descriptions.Item
          className="d-flex align-items-center"
          span={3}
          label="Full Name"
        >
          {first_name} {last_name}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Email">
          {email}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Phone Number">
          {phone_number}
        </Descriptions.Item>
        <Descriptions.Item label="Address" span={3}>
          {street_nr} {city}, {zip_code} {country}
        </Descriptions.Item>
      </Descriptions>

      <Suspense>
        <ProfileInformationModal
          userData={{
            first_name,
            last_name,
            email,
            is_employee,
            phone_number,
            street_nr,
            city,
            zip_code,
            country,
            id,
          }}
        />
      </Suspense>
    </Card>
  );
}

export default React.memo(ProfileInformation);
