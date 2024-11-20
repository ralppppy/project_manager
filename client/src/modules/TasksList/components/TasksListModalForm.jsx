import { Form, Modal, message } from "antd";
import React, { Suspense } from "react";
// // import { Editor } from "@tinymce/tinymce-react";

import { useDispatch, useSelector } from "react-redux";
import { TaskListController } from "../controllers";
import { AddTaskBreadCrumb, AttachmentDrawer, ModalForm } from ".";
import { useQueryClient } from "react-query";
function TasksListModalForm({
  isDashboard,
  isFeedback = false,
  queryKey,
  showTasks,
}) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [messageApi, contextHolder] = message.useMessage();

  const isUpdate = useSelector((state) => state.taskList.isUpdate);

  const modalOpen = useSelector((state) => state.taskList.modalOpen);
  const isView = useSelector((state) => state.taskList.isView);

  const { handleModalOpen } = TaskListController({
    dispatch,
    queryClient,
  });

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <AddTaskBreadCrumb
            isFeedback={isFeedback}
            queryKey={queryKey}
            form={form}
            showTasks={showTasks}
          />
        }
        open={modalOpen}
        footer={null}
        destroyOnClose={true}
        className={isView ? "w-90" : "w-70"}
        onOk={() => {
          handleModalOpen(false, { isUpdate });
        }}
        onCancel={() => {
          handleModalOpen(false, { isUpdate });
        }}
      >
        <ModalForm
          messageApi={messageApi}
          form={form}
          isDashboard={isDashboard}
          isFeedback={isFeedback}
        />
      </Modal>

      <Suspense fallback={<></>}>
        <AttachmentDrawer form={form} />
      </Suspense>
    </>
  );
}

export default React.memo(TasksListModalForm);
