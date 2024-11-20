import { Form, Modal, message } from "antd";
import React, { useEffect } from "react";
import { ModuleListController } from "@modules/ModuleList/controllers";
import { useDispatch, useSelector } from "react-redux";
import { ModuleForm } from ".";
import { useMutation, useQueryClient } from "react-query";

function ModuleModalForm({}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const modalOpen = useSelector((state) => state.module.modalOpen);
  const isUpdate = useSelector((state) => state.module.isUpdate);
  const updateModuleState = useSelector(
    (state) => state.module.updateModuleState
  );
  const loggedInUser = useSelector((state) => state.login.user);
  const selectedFilter = useSelector((state) => state.common.selectedFilter);
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { handleModalOpen, handleSubmit, handleSuccess, handleOnChangeClient } =
    ModuleListController({
      dispatch,
      messageApi,
      loggedInUser,
      form,
      queryClient,
      isUpdate,
      updateModuleState,
    });

  const { mutate } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (e) => {
      handleSuccess(e, selectedFilter);
    },
  });

  return (
    <Modal
      title={isUpdate ? "Update Module" : "Add Module"}
      open={modalOpen}
      footer={null}
      destroyOnClose={true}
      onOk={() => handleModalOpen(false, selectedFilter)}
      onCancel={() => handleModalOpen(false, selectedFilter)}
    >
      {contextHolder}
      <Form
        className="mt-3"
        layout="vertical"
        name="basic-"
        onFinish={mutate}
        form={form}
        preserve={false}
        onValuesChange={handleOnChangeClient}
        autoComplete="off"
        initialValues={{
          client_id: selectedFilter.clientId > 0 && selectedFilter.clientId,
          project_id: selectedFilter.projectId > 0 && selectedFilter.projectId,
        }}
      >
        <ModuleForm form={form} />
      </Form>
    </Modal>
  );
}

export default ModuleModalForm;
