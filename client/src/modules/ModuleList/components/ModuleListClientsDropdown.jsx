import { Form, Col, Select } from "antd";
import React from "react";

import { useQuery } from "react-query";
import { ModuleListController } from "@modules/ModuleList/controllers";
import { useSelector } from "react-redux";

const TOTAL_SPAN = 24;

const { Option } = Select;

function ModuleListClientsDropdown({ form }) {
  const { handleGetClients } = ModuleListController({});

  const user = useSelector((state) => state.login.user);
  const isUpdate = useSelector((state) => state.module.isUpdate);
  let QUERY_KEY_CLIENTS = ["clients_dropdown", user.organization_id];
  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEY_CLIENTS,
    queryFn: () => handleGetClients(user),
    enabled: !!user.organization_id,
    staleTime: Infinity,
  });

  return (
    <Col
      xs={{ span: TOTAL_SPAN }}
      sm={{ span: TOTAL_SPAN }}
      md={{ span: 12 }}
      lg={{ span: 12 }}
      xl={{ span: 12 }}
      xxl={{ span: 12 }}
    >
      <Form.Item
        label="Client"
        name="client_id"
        rules={[
          {
            required: true,
            message: "Client is required!",
          },
        ]}
      >
        <Select showSearch allowClear disabled={isUpdate}>
          {data?.map((client) => (
            <Option key={client.id} value={client.id}>
              {client.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
  );
}

export default React.memo(ModuleListClientsDropdown);
