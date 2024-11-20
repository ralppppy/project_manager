import React, { useEffect } from "react";
import { Card, List, Space, Tooltip, Typography, theme } from "antd";
import { useSelector } from "react-redux";
import { ProjectSettingsController } from "../../controllers";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { items } from "../../../Layout/components/SideBarMenu";
import { CloseOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

function UserTypesList({ userTypeList, setUserTypeList, currentDragging }) {
  const {
    handleGetSettings,
    getContrastTextColor,
    handleRemoveUserTypeList,
    handlUpdateLockUserTypeList,
  } = ProjectSettingsController({});
  const {
    token: {
      borderRadius,
      colorBgElevated,
      red5,
      green5,
      colorBgContainerDisabled,
    },
  } = theme.useToken();

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const is_super_admin = useSelector(
    (state) => state.login.user.is_super_admin
  );

  let apis = {
    get: "/api/user_types/user_type_settings_menus",
  };

  useEffect(() => {
    (async () => {
      let { data } = await handleGetSettings(apis, organization_id);

      setUserTypeList(data);
    })();
  }, []);

  let newMenus = [];

  items.forEach((c) => {
    newMenus = [...newMenus, ...c.children];
  });

  return (
    <div>
      <List
        grid={{
          gutter: 10,
          column: 4,
        }}
        bordered={false}
        header={<Title level={5}>User Types</Title>}
        dataSource={userTypeList}
        renderItem={(item) => (
          <Droppable
            isDropDisabled={
              currentDragging?.source?.droppableId === "menus"
                ? false
                : currentDragging?.source?.droppableId !==
                  `user_type_list_${item.id}`
            }
            droppableId={`user_type_list_${item.id}`}
          >
            {(provided) => (
              <div ref={provided.innerRef}>
                <List.Item>
                  <Card
                    style={{ padding: 0, margin: 0 }}
                    bodyStyle={{
                      backgroundColor: colorBgContainerDisabled,
                      padding: 0,
                      margin: 0,
                    }}
                    headStyle={{
                      backgroundColor: item.color,
                      color: getContrastTextColor(item.color),
                    }}
                    title={item.name}
                  >
                    <List
                      dataSource={item.menu_access}
                      renderItem={(menuItem, index) => (
                        <Draggable
                          key={`${item.id}-${menuItem.key}`}
                          draggableId={`${item.id}-${menuItem.key}`}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                cursor: "grab",
                                ...provided.draggableProps.style,
                              }}
                            >
                              {/* <LockOutlined /> <UnlockOutlined /> */}
                              <List.Item
                                extra={
                                  <Space size="large">
                                    <Tooltip
                                      title={
                                        menuItem.is_lock
                                          ? `UnLock this option. This will allow
                                            any user type to removing it.`
                                          : `
                                            Lock this option. This will prevent
                                            any user type, except the Super
                                            Admin, from removing it.
                                          `
                                      }
                                    >
                                      {is_super_admin ? (
                                        <>
                                          {menuItem.is_lock ? (
                                            <LockOutlined
                                              onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();

                                                let values = { is_lock: false };

                                                handlUpdateLockUserTypeList({
                                                  item,
                                                  menuItem,
                                                  setUserTypeList,
                                                  organization_id,
                                                  values,
                                                });
                                              }}
                                              style={{
                                                cursor: "pointer",
                                                color: green5,
                                              }}
                                            />
                                          ) : (
                                            <UnlockOutlined
                                              onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                let values = { is_lock: true };

                                                handlUpdateLockUserTypeList({
                                                  item,
                                                  menuItem,
                                                  setUserTypeList,
                                                  organization_id,
                                                  values,
                                                });
                                              }}
                                              style={{
                                                cursor: "pointer",
                                              }}
                                            />
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          {menuItem.is_lock && (
                                            <LockOutlined
                                              style={{
                                                cursor: "pointer",
                                                color: green5,
                                              }}
                                            />
                                          )}
                                        </>
                                      )}
                                    </Tooltip>

                                    {(!menuItem.is_lock || is_super_admin) && (
                                      <Tooltip title="Remove">
                                        <CloseOutlined
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            handleRemoveUserTypeList({
                                              item,
                                              menuItem,
                                              setUserTypeList,
                                              organization_id,
                                            });
                                          }}
                                          style={{
                                            cursor: "pointer",
                                          }}
                                        />
                                      </Tooltip>
                                    )}
                                  </Space>
                                }
                                className="p-2 mb-2"
                                style={{
                                  backgroundColor:
                                    currentDragging?.draggableId ===
                                    menuItem.key
                                      ? red5
                                      : colorBgElevated,
                                  // backgroundColor: colorBgElevated,
                                  borderRadius: borderRadius,
                                }}
                              >
                                <Text>
                                  {
                                    newMenus.find(
                                      (c) =>
                                        c.keyCode === menuItem.menu_key_code
                                    )?.icon
                                  }{" "}
                                  {
                                    newMenus.find(
                                      (c) =>
                                        c.keyCode === menuItem.menu_key_code
                                    )?.labelText
                                  }
                                </Text>
                              </List.Item>
                              {provided.placeholder}
                            </div>
                          )}
                        </Draggable>
                      )}
                    />
                  </Card>
                </List.Item>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
      />
    </div>
  );
}

export default UserTypesList;
