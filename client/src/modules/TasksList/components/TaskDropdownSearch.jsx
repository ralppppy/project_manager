import { Form, Input, Space, Tag, Typography } from "antd";
import React, { useEffect, useState } from "react";
import TaskDropdownSearchList from "./TaskDropdownSearchList";
import { useSelector } from "react-redux";

const { Text } = Typography;

function TaskDropdownSearch(form, setOpen) {
  const [searchTerm, setSearchTerm] = useState("");
  const [realSearch, setRealSearch] = useState("");
  const connected_to_id = Form.useWatch("connected_to_id", form);
  const isEmployee = useSelector((state) => state.login.user.is_employee);
  const currentUserId = useSelector((state) => state.login.user.id);
  const isUpdate = useSelector((state) => state.taskList.isUpdate);
  const updateData = useSelector((state) => state.taskList.updateData);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Perform the search with the current search term
      setRealSearch(searchTerm);
    }, 500);

    // Cleanup function to clear the timeout if the component unmounts or the search term changes
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <Space size={2} className="w-100" direction="vertical">
        {(!isUpdate || currentUserId === updateData?.creator?.id) && (
          <Input
            allowClear
            autoFocus
            onChange={handleChange}
            className="w-100 mb-2"
            placeholder="Search for Name / Id"
          />
        )}

        {connected_to_id && (
          <Tag
            onClose={() => {
              form.setFieldValue("connected_to_id", null);
            }}
            bordered={false}
            closable={isEmployee}
          >
            {`#${connected_to_id?.id} - ${connected_to_id?.task_title}`}
          </Tag>
        )}
        <TaskDropdownSearchList
          realSearch={realSearch}
          form={form}
          setOpen={setOpen}
        />
      </Space>
    </>
  );
}

export default TaskDropdownSearch;
