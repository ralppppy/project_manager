import { Button, Form, Popover, Tooltip } from "antd";
import TaskDropdownSearch from "./TaskDropdownSearch";
import "./styles.css";
import { BranchesOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function ConnectedToDropdown({ form }) {
  const [open, setOpen] = useState(false);
  const [openTooltip, setOpenToolTip] = useState(false);

  const isUpdate = useSelector((state) => state.taskList.isUpdate);
  const updateData = useSelector((state) => state.taskList.updateData);

  const handleOpenChange = (newOpen) => {
    if (newOpen) {
      setOpenToolTip(false);
    }
    setOpen(newOpen);
  };
  const handleOpenChangeToolTip = (newOpen) => {
    setOpenToolTip(newOpen);
  };

  const connected_to_id = Form.useWatch("connected_to_id");

  useEffect(() => {
    if (isUpdate) {
      form.setFieldValue("connected_to_id", updateData.parent_task);
    }
  }, [isUpdate, updateData]);

  return (
    <Form.Item name="connected_to_id">
      <Popover
        placement="bottom"
        trigger={["click"]}
        content={TaskDropdownSearch(form, setOpen)}
        title="Connect task"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Tooltip
          onOpenChange={handleOpenChangeToolTip}
          title={
            connected_to_id
              ? `#${connected_to_id?.id} - ${connected_to_id?.task_title}`
              : null
          }
          open={openTooltip}
        >
          <Button
            shape="circle"
            type={"dashed"}
            style={{
              borderColor: connected_to_id ? "#0072FF" : "unset",
            }}
            icon={
              <BranchesOutlined
                style={{ color: connected_to_id ? "#0072FF" : "unset" }}
              />
            }
          />
        </Tooltip>
      </Popover>
    </Form.Item>
  );
}

export default ConnectedToDropdown;
