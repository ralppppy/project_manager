import { Form, Col, Select } from "antd";
import React from "react";

import { useQuery } from "react-query";
import { ClientController } from "@modules/Client/controllers";
import { useSelector } from "react-redux";

const TOTAL_SPAN = 24;

const { Option } = Select;

function ClientsDropdown() {
  const { handleGetClientsDropdown } = ClientController({});

  const user = useSelector((state) => state.login.user);

  let QUERY_KEY_CLIENTS = ["clients", user.organization_id];
  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEY_CLIENTS,
    queryFn: () => handleGetClientsDropdown(user),
    enabled: !!user.organization_id,
    staleTime: Infinity,
  });

  return (
    <Col
      xs={{ span: TOTAL_SPAN }}
      sm={{ span: TOTAL_SPAN }}
      md={{ span: TOTAL_SPAN }}
      lg={{ span: TOTAL_SPAN }}
      xl={{ span: TOTAL_SPAN }}
      xxl={{ span: TOTAL_SPAN }}
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
        <Select showSearch allowClear>
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

export default React.memo(ClientsDropdown);
