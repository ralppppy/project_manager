import { Form, Select } from "antd";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import UserManagementController from "../controllers/UserManagementController";

function UserTypeForm({ form }) {
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const isUpdate = useSelector((state) => state.userManagement.isUpdate);

  const updateState = useSelector((state) => state.userManagement.updateState);

  const QUERY_KEY_USER_TYPE = ["settings_user_types_key_form", organization_id];

  const { handleGetUserTypes } = UserManagementController({});

  const { data, isLoading, isFetching } = useQuery({
    queryKey: QUERY_KEY_USER_TYPE,
    queryFn: () => handleGetUserTypes(organization_id),
    enabled: !!organization_id,
    keepPreviousData: true,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isUpdate && data) {
      form.setFieldValue("user_type_id", updateState.user_type_id);
    }
  }, [isUpdate, updateState, form, data]);

  return (
    <Form.Item
      label="User Type"
      name="user_type_id"
      rules={[
        {
          required: true,
          message: "User Type is required!",
        },
      ]}
    >
      <Select allowClear>
        {data?.data.map((d) => (
          <Select.Option key={d.id} value={d.id}>
            {d.name}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
}

export default React.memo(UserTypeForm);
