import { Input, Popover, theme } from "antd";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { ProjectSettingsController } from "../../controllers";
import { SketchPicker } from "react-color";

import "./styles.css";

const { useToken } = theme;

function SettingsInput({
  organization_id,
  apis,
  SETTINGS_KEY,
  settingsData,
  invalidateQueries,
}) {
  const {
    token: { colorPrimary },
  } = useToken();

  const [inputValue, setInputValue] = useState("");

  const [color, setColor] = useState(colorPrimary);

  const queryClient = useQueryClient();

  const { handleAddNewSettingData } = ProjectSettingsController({});

  const mutation = useMutation({
    mutationFn: handleAddNewSettingData,
    onSuccess: (data) => {
      invalidateQueries.forEach((queries) => {
        queryClient.invalidateQueries(queries);
      });
      queryClient.setQueryData(SETTINGS_KEY, (prevData) => {
        prevData.data.push(data.data);
        setInputValue("");
        return prevData;
      });
    },
  });

  return (
    <Input
      className="mb-2"
      prefix={
        <Popover
          content={
            <SketchPicker
              color={color}
              onChange={(color) => setColor(color.hex)}
            />
          }
        >
          {/* <div className="color-picker-container"> */}
          <div
            className="color-picker-custom"
            style={{ backgroundColor: color }}
          ></div>
          {/* </div> */}
        </Popover>
      }
      value={inputValue}
      onChange={(e) => {
        let value = e.target.value;
        setInputValue(value);
      }}
      //   onBlur={() => alert("WO")}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          // Handle Enter key press here
          e.preventDefault(); // Prevent the default behavior of the Enter key (e.g., form submission)
          //   // Perform any action you want, such as submitting a form or processing the input
          //   let inputValue = ref.current.input.value;
          //   //   alert(inputValue);

          if (inputValue) {
            mutation.mutate({
              values: {
                name: inputValue,
                color: color,
                sort: settingsData.length,
              },
              organization_id,
              apis,
            });
          }

          //   ref.current.input.value = "";
        }
      }}
      placeholder="Type and enter to add more"
    />
  );
}

export default SettingsInput;
