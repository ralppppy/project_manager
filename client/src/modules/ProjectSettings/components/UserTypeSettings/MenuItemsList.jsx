import React from "react";
import { items } from "../../../Layout/components/SideBarMenu";
import { List, Typography, theme } from "antd";
import { Draggable } from "@hello-pangea/dnd";

const { Title, Text } = Typography;

function MenuItemsList() {
  let newMenus = [];
  const {
    token: { borderRadius, colorBgContainerDisabled, colorBgElevated },
  } = theme.useToken();

  items.forEach((c) => {
    newMenus = [...newMenus, ...c.children];
  });

  return (
    <div>
      <List
        dataSource={newMenus}
        header={<Title level={5}>Menus</Title>}
        renderItem={(item, index) => (
          <Draggable
            key={`${item.keyCode}`}
            draggableId={`${item.keyCode}`}
            index={index}
          >
            {(provided, snapshot) => (
              <>
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{
                    cursor: "grab",
                    ...provided.draggableProps.style,
                    transform: snapshot.isDragging
                      ? provided.draggableProps.style?.transform
                      : "translate(0px, 0px)",
                  }}
                >
                  <List.Item
                    className="p-2 mb-2"
                    style={{
                      backgroundColor: colorBgElevated,
                      borderRadius: borderRadius,
                    }}
                  >
                    <Text>
                      {item.icon} {item.labelText}
                    </Text>
                  </List.Item>
                </div>
                {snapshot.isDragging && (
                  <List.Item
                    className="p-2 mb-2"
                    style={{
                      transform: "none !important",
                      backgroundColor: colorBgContainerDisabled,
                      borderRadius: borderRadius,
                    }}
                  >
                    <Text>
                      {item.icon} {item.labelText}
                    </Text>
                  </List.Item>
                )}
              </>
            )}
          </Draggable>
        )}
      />
    </div>
  );
}

export default MenuItemsList;
