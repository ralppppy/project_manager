import { Button, Form, Input, Modal } from "antd";
import React from "react";
import { ClientController } from "../controllers";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "react-query";

function ClientModalForm({ QUERY_KEY }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const isUpdate = useSelector((state) => state.client.isUpdate);
  const modalOpen = useSelector((state) => state.client.modalOpen);
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const { handleModalOpen, handleSubmit, handleSuccess } = ClientController({
    dispatch,
    isUpdate,
    organization_id,
    QUERY_KEY,
    queryClient,
  });

  const { mutate } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: handleSuccess,
  });

  return (
    <Modal
      title={isUpdate ? "Update Client" : "Add Client"}
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
        <Form.Item
          label="Client ID"
          name="client_id_text"
          rules={[
            {
              required: true,
              message: "Client id is required",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Client name"
          name="name"
          rules={[
            {
              required: true,
              message: "Client name is required",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button className="w-100" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default React.memo(ClientModalForm);
