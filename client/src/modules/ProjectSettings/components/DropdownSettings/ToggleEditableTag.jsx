import React, { useState } from "react";
import { Tag, Input, Select, Space } from "antd";

const { Option } = Select;

const ToggleEditableTag = ({
  title,
  color,
  setEnableSave,
  defaultColorData,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleEditClick = () => {
    setIsEditing(true);
    setEnableSave(true);
  };

  const handleInputChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  return isEditing ? (
    <Space size={10}>
      <Input
        value={editedTitle}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onPressEnter={handleInputBlur}
        className="w-100"
      />
      <Select style={{ width: "60px" }}>
        {defaultColorData.map((col) => (
          <Option key={col.id}>
            <Tag color={col.color}>{"_"}</Tag>
          </Option>
        ))}
      </Select>
    </Space>
  ) : (
    <>
      <Tag color={color} onClick={handleEditClick} className="w-100">
        {title}
      </Tag>
    </>
  );
};

export default React.memo(ToggleEditableTag);
