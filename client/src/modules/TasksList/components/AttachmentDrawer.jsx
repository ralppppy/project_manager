import { Drawer } from "antd";
import React from "react";
import { TaskListController } from "../controllers";
import { useDispatch, useSelector } from "react-redux";

import "./styles.css";
import AttachmentTabs from "./AttachmentTabs";

function AttachmentDrawer({ form }) {
  const dispatch = useDispatch();
  const drawerOpen = useSelector((state) => state.taskList.drawerOpen);

  const { handleDrawerState } = TaskListController({
    dispatch,
  });

  return (
    <>
      <Drawer
        title="Attachments"
        placement="right"
        onClose={() => handleDrawerState(false)}
        open={drawerOpen}
        // style={{ zIndex: 2000 }}
      >
        <AttachmentTabs form={form} isCommentAttachment={true} />
      </Drawer>
    </>
  );
}

export default React.memo(AttachmentDrawer);
