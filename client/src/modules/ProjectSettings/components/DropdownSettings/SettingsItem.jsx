import React, { useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { ProjectSettingsController } from "../../controllers";
import { message, theme } from "antd";

const { useToken } = theme;

function SettingsItem({
  item,
  apis,
  organization_id,
  SETTINGS_KEY,
  invalidateQueries,
}) {
  const { getContrastTextColor, handleUpdateNewSettingData } =
    ProjectSettingsController({});
  const {
    token: { colorText, colorTextDisabled },
  } = useToken();
  const [messageApi, contextHolder] = message.useMessage();

  const queryClient = useQueryClient();

  const [content, setContent] = useState(item.name);

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

  // const [inputValue, setInputValue] = useState("");
  const handleInput = (event) => {
    const newContent = event.target.innerHTML.replace(/&nbsp;/g, " ");

    setContent(newContent);
  };

  const handleBlur = () => {
    if (!content) {
      messageApi.open({
        type: "error",
        content: "Value should not be empty",
      });

      ref.current.focus();
      return;
    } else {
      mutation.mutate({
        apis,
        organization_id,
        content: { key: "name", value: content },
        item,
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default behavior of creating a new line

      //   console.log("Content changed:", content);
    }
  };

  const ref = useRef();

  return (
    <>
      {contextHolder}
      <div
        ref={ref}
        onKeyDown={handleKeyDown}
        contentEditable={item.active}
        style={{
          color: getContrastTextColor(
            item.active ? item.color : colorTextDisabled,
            colorText
          ),
        }}
        onInput={handleInput}
        onBlur={handleBlur}
        dangerouslySetInnerHTML={{ __html: `${item.name}` }}
      />
    </>
  );
}

export default SettingsItem;
