import { Form, Select } from "antd";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import UserManagementController from "../controllers/UserManagementController";

function DepartmentForm({ form }) {
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );
  const QUERY_KEY_USER_TYPE = ["settings_department_key_form", organization_id];

  const isUpdate = useSelector((state) => state.userManagement.isUpdate);

  const updateState = useSelector((state) => state.userManagement.updateState);
  const { handleGetDeparments } = UserManagementController({});

  const { data, isLoading, isFetching } = useQuery({
    queryKey: QUERY_KEY_USER_TYPE,
    queryFn: () => handleGetDeparments(organization_id),
    enabled: !!organization_id,
    keepPreviousData: true,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isUpdate && data) {
      form.setFieldValue("dept_id", updateState.dept_id);
    }
  }, [isUpdate, updateState, form, data]);

  return (
    <Form.Item
      label="Department"
      name="dept_id"
      rules={[
        {
          required: true,
          message: "Department is required!",
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

export default React.memo(DepartmentForm);
