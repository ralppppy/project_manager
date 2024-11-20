import { Divider, List, Popover, Space, Tooltip, theme } from "antd";
import React, { useState } from "react";
import { SettingsItem } from ".";
import { SketchPicker } from "react-color";
import { ProjectSettingsController } from "../../controllers";
import { useMutation, useQueryClient } from "react-query";
import {
  DragOutlined,
  EyeOutlined,
  CloseOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
const { useToken } = theme;

function SettingsItemContainer({
  item,
  organization_id,
  apis,
  SETTINGS_KEY,
  borderRadius,
  provided,
  messageApi,
  invalidateQueries,
  deleteErrorMessage,
}) {
  const {
    token: { colorText, colorTextDisabled },
  } = useToken();
  const [color, setColor] = useState(item.color);

  const queryClient = useQueryClient();

  const {
    handleUpdateNewSettingData,
    getContrastTextColor,
    handleDeleteSettingData,
  } = ProjectSettingsController({});

  const mutation = useMutation({
    mutationFn: handleUpdateNewSettingData,
    onSuccess: ({ response, values }) => {
      invalidateQueries.forEach((queries) => {
        queryClient.invalidateQueries(queries);
      });

      queryClient.setQueryData(SETTINGS_KEY, (prevData) => {
        let newData = prevData.data.map((prev) => {
          if (prev.id === values.id) {
            return { ...prev, ...values };
          }

          return prev;
        });

        return { ...prevData, data: newData };
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: handleDeleteSettingData,
    onSuccess: ({ response, data }) => {
      if (typeof response === "boolean") {
        messageApi.open({
          type: "error",
          content: deleteErrorMessage,
        });
      } else {
        invalidateQueries.forEach((queries) => {
          queryClient.invalidateQueries(queries);
        });

        queryClient.setQueryData(SETTINGS_KEY, (prevData) => {
          let newData = prevData.data.filter((prev) => {
            return prev.id !== data.id;
          });

          return { ...prevData, data: newData };
        });
      }
    },
  });

  const CustomDragHandle = ({ provided }) => (
    <div {...provided.dragHandleProps} style={{ cursor: "grab" }}>
      {/* Insert your custom grab handle icon or element here */}
      <div className="custom-grab-handle">
        <DragOutlined
          style={{
            fontSize: 15,

            color: getContrastTextColor(
              item.active ? item.color : colorTextDisabled,
              colorText
            ),
          }}
        />
      </div>
    </div>
  );

  return (
    <List.Item
      className="p-2 mb-2"
      style={{
        backgroundColor: item.active ? item.color : colorTextDisabled,
        borderRadius: borderRadius,
      }}
    >
      <div className="d-flex w-100 align-items-center justify-content-between">
        <Space>
          {item.active && (
            <Popover
              content={
                <SketchPicker
                  color={color || "#ffffff"}
                  onChange={(color) => setColor(color.hex)}
                  onChangeComplete={(color) => {
                    mutation.mutate({
                      apis,
                      organization_id,
                      content: { key: "color", value: color.hex },
                      item,
                    });
                  }}
                />
              }
            >
              <div className="color-picker-container">
                <div
                  className="color-picker-custom"
                  style={{ backgroundColor: color }}
                ></div>
              </div>
            </Popover>
          )}

          <SettingsItem
            organization_id={organization_id}
            apis={apis}
            item={item}
            SETTINGS_KEY={SETTINGS_KEY}
            invalidateQueries={invalidateQueries}
          />
        </Space>
        <Space
          size={0}
          align="center"
          split={
            <Divider
              style={{
                color: getContrastTextColor(
                  item.active ? item.color : colorTextDisabled,
                  colorText
                ),
              }}
              type="vertical"
            />
          }
        >
          <Tooltip title="Delete">
            <CloseOutlined
              onClick={() => {
                deleteMutation.mutate({
                  apis,
                  organization_id,
                  data: item,
                });
              }}
              style={{
                cursor: "pointer",
                fontSize: 15,
                color: getContrastTextColor(
                  item.active ? item.color : colorTextDisabled,
                  colorText
                ),
              }}
            />
          </Tooltip>

          {item.active ? (
            <Tooltip title="Hide">
              <EyeOutlined
                onClick={() => {
                  mutation.mutate({
                    apis,
                    organization_id,
                    content: { key: "active", value: !item.active },
                    item,
                  });
                }}
                style={{
                  cursor: "pointer",
                  fontSize: 15,
                  color: getContrastTextColor(
                    item.active ? item.color : colorTextDisabled,
                    colorText
                  ),
                }}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Show">
              <EyeInvisibleOutlined
                onClick={() => {
                  mutation.mutate({
                    apis,
                    organization_id,
                    content: { key: "active", value: !item.active },
                    item,
                  });
                }}
                style={{
                  cursor: "pointer",
                  fontSize: 15,
                  color: getContrastTextColor(
                    item.active ? item.color : colorTextDisabled,
                    colorText
                  ),
                }}
              />
            </Tooltip>
          )}

          <CustomDragHandle provided={provided} />
        </Space>
      </div>
    </List.Item>
  );
}

export default SettingsItemContainer;
