import { Alert, Col, Row, Typography, message } from "antd";
import React, { Suspense, useState } from "react";
import { MenuItemsList, UserTypesList } from ".";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useMutation, useQueryClient } from "react-query";
import { ProjectSettingsController } from "../../controllers";
import { useSelector } from "react-redux";

const { Title, Paragraph } = Typography;

const TOTAL_SPAN = 24;

function UserTypeSettings() {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [userTypeList, setUserTypeList] = useState([]);
  const [currentDragging, setCurrentDragging] = useState({});

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const { handleUpdateUserTypeAuth } = ProjectSettingsController({
    queryClient,
    messageApi,
  });

  const onDragStart = (info) => {
    setCurrentDragging(info);
  };

  return (
    <div>
      {contextHolder}
      <div>
        <Title level={4}>User type Page Assignment</Title>

        <Alert
          description="Welcome to the User type Page Assignment portal! This feature ensures a
      personalized and secure user experience tailored to individual roles
      within our platform. As an administrator, you have the authority to
      assign specific pages to users based on their roles and permissions.
      This functionality guarantees that each user can access only the pages
      relevant to their role, maintaining a streamlined and efficient
      workflow. Navigate through user profiles, set page assignments, and
      empower your team with a customized interface that caters to their
      responsibilities. Enhance security and optimize user engagement with our
      User type Page Assignment tool."
          type="info"
        />
      </div>

      <DragDropContext
        onBeforeDragStart={onDragStart}
        onDragEnd={(info) => {
          handleUpdateUserTypeAuth({
            info,
            organization_id,
            userTypeList,
            setUserTypeList,
            setCurrentDragging,
          });
        }}
      >
        <Row gutter={[16, 16]}>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: 4 }}
            lg={{ span: 4 }}
            xl={{ span: 4 }}
            xxl={{ span: 4 }}
          >
            <Suspense fallback={<></>}>
              <Droppable
                isDropDisabled={true}
                isCombineEnabled={false}
                droppableId={`menus`}
              >
                {(provided) => (
                  <div ref={provided.innerRef}>
                    <MenuItemsList />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Suspense>
          </Col>

          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: 20 }}
            lg={{ span: 20 }}
            xl={{ span: 20 }}
            xxl={{ span: 20 }}
          >
            <Suspense fallback={<></>}>
              <UserTypesList
                currentDragging={currentDragging}
                userTypeList={userTypeList}
                setUserTypeList={setUserTypeList}
              />
            </Suspense>
          </Col>
        </Row>
      </DragDropContext>
    </div>
  );
}

export default UserTypeSettings;
