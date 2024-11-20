import { Form, Modal, message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "react-query";
import { HolidayController } from "../controllers";
import HolidayForm from "./HolidayForm";

function PojectModalForm({ QUERY_KEY }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );
  const [messageApi, contextHolder] = message.useMessage();
  const modalOpen = useSelector((state) => state.holiday.modalOpen);
  const isUpdate = useSelector((state) => state.holiday.isUpdate);

  const [form] = Form.useForm();

  const { handleModalOpen, handleSubmit } = HolidayController({
    isUpdate,
    dispatch,
    organization_id,
    queryClient,
  });

  const { mutate } = useMutation({
    mutationFn: handleSubmit,
  });

  return (
    <Modal
      title={isUpdate ? "Update Holiday" : "Add Holiday"}
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
        <HolidayForm form={form} />
      </Form>
    </Modal>
  );
}

export default PojectModalForm;
