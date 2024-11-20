import {
  Card,
  ColorPicker,
  Descriptions,
  Popover,
  Radio,
  Space,
  theme,
} from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProfileController } from "../controllers";
import { SketchPicker } from "react-color";
import "./styles.css";
import { setBackgroundColor } from "../../../state_management/Global";

function PlatformSettings() {
  const cardHeight = useSelector((state) => state.profile.cardHeight);
  const tempColor = useSelector((state) => state.global.tempColor);
  const primaryColor = useSelector((state) => state.global.primaryColor);
  const background = useSelector((state) => state.global.background);
  const dispatch = useDispatch();

  const { token } = theme.useToken();

  const { handleChangePrimaryThemeColor, handleChangePrimaryTempThemeColor } =
    ProfileController({ dispatch });

  const handleColorChange = (e) => {
    dispatch(setBackgroundColor(JSON.parse(e.target.value)));
  };

  const colorOptions = [
    {
      label: "Default",
      value: {
        color: "#fff",
        colorShow: "#fff",
        borderColor: "#f0f0f0",
        textColor: "rgba(0, 0, 0, 0.88)",
      },
    },
    {
      label: "Grayscale",
      value: {
        color: "#dddddd",
        colorShow: "#dddddd",
        borderColor: "#cecece",
        textColor: "rgba(0, 0, 0, 0.88)",
      },
    }, //#223446
    {
      label: "Dim",
      value: {
        color: "#15202b",
        colorShow: "#223446",
        borderColor: "#35506c",
        textColor: "rgba(255, 255, 255, 0.88)",
      },
    }, //#223446
    {
      label: "Lights Out",
      value: {
        color: "#18191a",
        colorShow: "#2c2d2f",
        borderColor: "#47494c",
        textColor: "rgba(255, 255, 255, 0.88)",
      },
    },
    {
      label: "Pitch Black",
      value: {
        color: "#000",
        colorShow: "#141414",
        borderColor: "#303030",
        textColor: "rgba(255, 255, 255, 0.88)",
      },
    },
  ];

  return (
    <Card bodyStyle={{ height: cardHeight }} id="profile-platform">
      <Descriptions colon={false} title="Platform Settings" layout="vertical">
        <Descriptions.Item span={3} label={"Select theme color"}>
          <Popover
            content={
              <SketchPicker
                color={tempColor}
                onChange={(color) =>
                  handleChangePrimaryTempThemeColor(color.hex)
                }
                onChangeComplete={(color) =>
                  handleChangePrimaryThemeColor(color.hex)
                }
              />
            }
          >
            <div className="color-picker-container">
              <div
                className="color-picker-custom"
                style={{ backgroundColor: primaryColor }}
              ></div>
            </div>
          </Popover>
        </Descriptions.Item>
        <Descriptions.Item span={3} label={"Select Background"}>
          <Radio.Group
            onChange={handleColorChange}
            value={JSON.stringify(background)}
          >
            {colorOptions.map((option, index) => (
              <Space
                key={index}
                className="mr-3"
                align="center"
                direction="vertical"
              >
                <div className="color-picker-container-background">
                  <div
                    className="color-picker-custom"
                    style={{ backgroundColor: option.value.colorShow }}
                  ></div>
                </div>
                <Radio value={JSON.stringify(option.value)}>
                  {option.label}
                </Radio>
              </Space>
            ))}
          </Radio.Group>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}

export default React.memo(PlatformSettings);
