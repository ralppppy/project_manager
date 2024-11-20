import {
  Dropdown,
  Popconfirm,
  Button,
  Popover,
  List,
  theme,
  Space,
  Typography,
} from "antd";
import React, { useState } from "react";
import { ProjectController } from "../controllers";
import { useSelector } from "react-redux";
import { QueryCache, useMutation, useQuery, useQueryClient } from "react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const { Text } = Typography;

function SetProjectPriority({ QUERY_KEY }) {
  const QUERY_KEY_PROJECT_DROPDOWN = ["projects_dropdown"];
  const queryClient = useQueryClient();

  const state = queryClient.getQueryState(QUERY_KEY_PROJECT_DROPDOWN);
  const [sortItems, setItems] = useState(state?.data || []);

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const { token } = theme.useToken();

  const { handleGetProjectsDropdown, handleUpdateSorting, handleSuccessSort } =
    ProjectController({
      organization_id,
      setItems,
      queryClient,
      QUERY_KEY_PROJECT_DROPDOWN,
      QUERY_KEY,
    });

  useQuery({
    queryKey: QUERY_KEY_PROJECT_DROPDOWN,
    queryFn: () => handleGetProjectsDropdown(organization_id),
    enabled: !!organization_id,
    // keepPreviousData: true,
    staleTime: Infinity,
  });
  const { mutate } = useMutation({
    mutationFn: handleUpdateSorting,
    onSuccess: handleSuccessSort,
  });

  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result.map((c, index) => ({ id: c.id, sort: index }));
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer

    // change background colour if dragging
    background: isDragging ? token.colorBgContainerDisabled : token.colorBgBase,
    borderBottom: `1px solid ${token.colorBgContainerDisabled}`,

    // styles we need to apply on draggables
    ...draggableStyle,
    cursor: isDragging ? "grabbing" : "grab",
  });

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      sortItems,
      result.source.index,
      result.destination.index
    );

    setItems((prev) => {
      const prevSortData = {};

      prev.forEach((item) => {
        prevSortData[item.id] = item;
      });

      let newProjectData = items.map((newData) => {
        return { ...prevSortData[newData.id], ...newData };
      });

      return newProjectData;
    });
    mutate(items);
  };

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver
      ? token.colorBgContainerDisabled
      : token.colorBgBase,
    cursor: isDraggingOver ? "grabbing" : "grab",
  });

  const content = (
    <div
      id="scrollableDiv"
      style={{
        height: 200,
        overflow: "auto",
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              <List
                size="small"
                dataSource={sortItems}
                renderItem={(item, index) => {
                  return (
                    <Draggable
                      key={`${item.id}`}
                      draggableId={`${item.id}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <List.Item>
                            <Space size={0} direction="vertical">
                              <Text>{item.name}</Text>
                              <Text type="secondary" style={{ fontSize: 11 }}>
                                {item.client.name}
                              </Text>
                            </Space>
                          </List.Item>
                        </div>
                      )}
                    </Draggable>
                  );
                }}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );

  return (
    <div>
      <Popover trigger={["click"]} content={content} title="Adjust priority">
        <Button type="link">Set Project Priority</Button>
      </Popover>
    </div>
  );
}

export default React.memo(SetProjectPriority);
