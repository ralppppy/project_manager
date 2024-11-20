import { Form, Modal, message } from "antd";
import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClientController } from "../controllers";
import { UserClientForm } from ".";
import { SetPasswordController } from "../../Guest/controller";
import UserManagementController from "../../UserManagement/controllers/UserManagementController";
import { useMutation, useQueryClient } from "react-query";

function AddUserClientModal({ form }) {
  const dispatch = useDispatch();
  const addUserClientModalOpen = useSelector(
    (state) => state.client.addUserClientModalOpen
  );
  const isUpdatingUser = useSelector((state) => state.client.isUpdatingUser);
  const currentUpdateUser = useSelector(
    (state) => state.client.currentUpdateUser
  );

  const queryClient = useQueryClient();
  const currentUserClient = useSelector(
    (state) => state.client.currentUserClient
  );
  const [messageApi, contextHolder] = message.useMessage();

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const { handleUserClientModalOpen, handlePasswordChange } = ClientController({
    dispatch,
  });

  const { handleSubmit } = UserManagementController({
    dispatch,
  });

  const { mutate } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: ([response, error, isUpdate]) => {
      if (error) {
        messageApi.error(error.response.data.message);
      } else {
        handleUserClientModalOpen(false);

        const CLIENT_USER_KEY = [
          "client_user_management",
          organization_id,
          currentUserClient.id,
        ];

        console.log(isUpdate, "isUpdate");
        queryClient.invalidateQueries(CLIENT_USER_KEY);
        messageApi.open({
          type: "success",
          content: isUpdate
            ? "Succesfully updated user client!"
            : "Succesfully added user client!",
        });
      }
    },
  });

  useEffect(() => {
    if (isUpdatingUser) {
      form.setFieldsValue({ ...currentUpdateUser, ...currentUpdateUser.user });
    } else {
      form.resetFields();
    }
  }, [isUpdatingUser]);

  return (
    <>
      {contextHolder}
      <Modal
        title={"Add user client"}
        open={addUserClientModalOpen}
        footer={null}
        className="w-50"
        destroyOnClose={true}
        onOk={() => handleUserClientModalOpen(false)}
        onCancel={() => handleUserClientModalOpen(false)}
      >
        <Form
          className="mt-3"
          layout="vertical"
          name="basic-"
          onFinish={(values) => {
            values = {
              ...values,
              client_id: currentUserClient.id,
              is_employee: false,
            };

            mutate({
              values,
              organization_id,
              isUpdate: isUpdatingUser,
              isClient: true,
            });
          }}
          form={form}
          // preserve={false}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
          onValuesChange={(values) => {
            if (values.hasOwnProperty("password")) {
              handlePasswordChange(values.password);
            }
          }}
        >
          <Suspense fallback={<></>}>
            <UserClientForm form={form} />
          </Suspense>
        </Form>
      </Modal>
    </>
  );
}

export default AddUserClientModal;
