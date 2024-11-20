import { Form, Modal } from "antd";
import React, { useRef } from "react";
import ExactPlaceTableController from "../controllers/ExactPlaceTableController";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "react-query";

function TableModalForm({
  QUERY_KEY,
  ModalFormComponent,
  apiPath,
  messageApi,
  onAfterSubmit,
  modalTitle,
  mutateTableData,
}) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const modalOpen = useSelector((state) => state.table.utilities.modalOpen);
  const user = useSelector((state) => state.login.user);
  const [form] = Form.useForm();

  const { handleModalOpen, handleSubmit, handleSuccess } =
    ExactPlaceTableController({
      dispatch,
      user,
      queryClient,
      QUERY_KEY,
      apiPath,
      messageApi,
      onAfterSubmit,
    });

  const { mutate } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: handleSuccess,
  });

  return (
    <div>
      <Modal
        title={modalTitle}
        open={modalOpen}
        footer={null}
        destroyOnClose={true}
        onOk={() => handleModalOpen(false)}
        onCancel={() => handleModalOpen(false)}
      >
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
          {ModalFormComponent({ form, mutateTableData, QUERY_KEY })}
        </Form>
      </Modal>
    </div>
  );
}

export default React.memo(TableModalForm);
