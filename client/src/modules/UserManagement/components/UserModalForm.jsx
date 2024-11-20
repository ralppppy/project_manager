import { Button, Form, Modal, message } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "react-query";
import UserManagementController from "../controllers/UserManagementController";
import { UserForm } from ".";

function PojectModalForm({ QUERY_KEY }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );
  const modalOpen = useSelector((state) => state.userManagement.modalOpen);
  const isUpdate = useSelector((state) => state.userManagement.isUpdate);
  const { handleModalOpen, handleSubmit } = UserManagementController({
    dispatch,
  });

  const [form] = Form.useForm();

  const { mutate } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: () => {
      handleModalOpen(false);
      queryClient.invalidateQueries(["user_management"]);
    },
  });

  return (
    <Modal
      title={isUpdate ? "Update Project" : "Add User"}
      open={modalOpen}
      footer={null}
      className="w-50"
      destroyOnClose={true}
      onOk={() => handleModalOpen(false)}
      onCancel={() => handleModalOpen(false)}
    >
      <Form
        className="mt-3"
        layout="vertical"
        name="basic-"
        onFinish={(values) => {
          values = { ...values, is_employee: true };

          mutate({ values, organization_id, isUpdate });
        }}
        form={form}
        preserve={false}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <UserForm form={form} QUERY_KEY={QUERY_KEY} />
      </Form>
    </Modal>
  );
}

export default PojectModalForm;
