import React, { Suspense, useEffect, useState } from "react";
import { Card, List, message, theme } from "antd";

import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { ProjectSettingsController } from "../../controllers";
import { SettingsInput, SettingsItemContainer } from ".";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const { useToken } = theme;

const SettingsCard = ({
  KEY,
  title,
  apis,
  invalidateQueries,
  deleteErrorMessage,
}) => {
  const {
    token: { borderRadius },
  } = useToken();

  const [messageApi, contextHolder] = message.useMessage();

  const [settingsData, setSettingsData] = useState([]);

  const { handleGetSettings, handleUpdateSorting } = ProjectSettingsController({
    setSettingsData,
  });

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const queryClient = useQueryClient();

  const SETTINGS_KEY = [KEY, organization_id];

  const { data, isFetching, isLoading } = useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: () => handleGetSettings(apis, organization_id),

    enabled: !!organization_id,
    keepPreviousData: true,

    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: handleUpdateSorting,
    onSuccess: ({ data }) => {
      invalidateQueries.forEach((queries) => {
        queryClient.invalidateQueries(queries);
      });

      queryClient.setQueryData(SETTINGS_KEY, (prevData) => {
        return { ...prevData, data };
      });
    },
  });

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    let newList = Array.from(settingsData);

    const [removed] = newList.splice(result.source.index, 1);
    newList.splice(result.destination.index, 0, removed);

    newList = newList.map((c, index) => ({ ...c, sort: index }));

    setSettingsData(newList);

    mutation.mutate({ data: newList, apis, organization_id });
  };

  useEffect(() => {
    if (data) {
      setSettingsData(data.data);
    }
  }, [data]);

  return (
    <>
      {contextHolder}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={`list_${KEY}`}>
          {(provided) => (
            <div ref={provided.innerRef}>
              <Card title={title}>
                <List
                  loading={isFetching}
                  header={
                    <Suspense fallback={<></>}>
                      <SettingsInput
                        SETTINGS_KEY={SETTINGS_KEY}
                        organization_id={organization_id}
                        apis={apis}
                        settingsData={settingsData}
                        invalidateQueries={invalidateQueries}
                      />
                    </Suspense>
                  }
                  dataSource={settingsData}
                  split={false}
                  renderItem={(item, index) => (
                    <Draggable
                      key={`${item.id}`}
                      draggableId={`${item.id}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          // {...provided.dragHandleProps}
                        >
                          <SettingsItemContainer
                            item={item}
                            organization_id={organization_id}
                            apis={apis}
                            SETTINGS_KEY={SETTINGS_KEY}
                            borderRadius={borderRadius}
                            provided={provided}
                            messageApi={messageApi}
                            invalidateQueries={invalidateQueries}
                            deleteErrorMessage={deleteErrorMessage}
                          />
                        </div>
                      )}
                    </Draggable>
                  )}
                />{" "}
                {provided.placeholder}
              </Card>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default React.memo(SettingsCard);
