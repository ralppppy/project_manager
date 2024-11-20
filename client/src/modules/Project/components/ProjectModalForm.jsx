import { Form, Modal, message } from "antd";
import React from "react";
import { ProjectController } from "../controllers";
import { useDispatch, useSelector } from "react-redux";
import { ProjectForm } from ".";
import { useMutation, useQueryClient } from "react-query";

function PojectModalForm({ QUERY_KEY }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );
  const [messageApi, contextHolder] = message.useMessage();
  const modalOpen = useSelector((state) => state.project.modalOpen);
  const isUpdate = useSelector((state) => state.project.isUpdate);
  const { handleModalOpen, handleSubmit, handleSuccess } = ProjectController({
    dispatch,
    messageApi,
    QUERY_KEY,
    organization_id,
    queryClient,
    isUpdate,
  });

  const [form] = Form.useForm();

  const { mutate } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: handleSuccess,
  });

  return (
    <Modal
      title={isUpdate ? "Update Project" : "Add Project"}
      open={modalOpen}
      footer={null}
      destroyOnClose={true}
      onOk={() => handleModalOpen(false)}
      onCancel={() => handleModalOpen(false)}
    >
      {contextHolder}
      <Form
        className="mt-3"
        layout="vertical"
        name="basic-"
        onFinish={mutate}
        form={form}
        preserve={false}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <ProjectForm form={form} QUERY_KEY={QUERY_KEY} />
      </Form>
    </Modal>
  );
}

export default PojectModalForm;
