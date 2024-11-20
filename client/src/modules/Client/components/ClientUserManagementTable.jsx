import { Button, Space, Table, Typography, message } from "antd";
import React, { useMemo } from "react";

import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { ClientController } from "../controllers";
import { useQuery } from "react-query";
// import { TableHeader } from ".";

const { Text, Title } = Typography;

function UserManagementTable({ record, form }) {
  const dispatch = useDispatch();

  const { organization_id, id: user_id } = useSelector(
    (state) => state.login.user
  );
  const [messageApi, contextHolder] = message.useMessage();

  const CLIENT_USER_KEY = [
    "client_user_management",
    organization_id,
    record.id,
  ];

  const {
    getClientUser,
    handleUserClientModalOpen,
    // onTableChange,
    // handleModalOpen,
    // handleChangeIsUpdateState,
  } = ClientController({
    dispatch,
    // navigate,
    // QUERY_KEY,
    // messageApi,
    // queryClient,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: CLIENT_USER_KEY,
    queryFn: () => getClientUser({ organization_id, record }),
    enabled: !!organization_id,
    keepPreviousData: true,
    staleTime: Infinity,
  });

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        editable: true,
        sorter: true,
        width: "10%",
        // ...ColumnSearchProps(
        //   "id",
        //   dispatch,
        //   setSearch,
        //   {
        //     pageSize,
        //     page,
        //   },
        //   navigate
        // ),
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
      },
      {
        title: "First Name",
        dataIndex: "user",
        key: "first_name",
        editable: true,
        width: "20%",
        sorter: true,
        // ...ColumnSearchProps(
        //   "first_name",
        //   dispatch,
        //   setSearch,
        //   {
        //     pageSize,
        //     page,
        //   },
        //   navigate
        // ),
        render: (user) => {
          return <Text>{user.first_name}</Text>;
        },
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
      },
      {
        title: "Last Name",
        dataIndex: "user",
        key: "last_name",
        editable: true,
        width: "20%",
        sorter: true,

        // ...ColumnSearchProps(
        //   "last_name",
        //   dispatch,
        //   setSearch,
        //   {
        //     pageSize,
        //     page,
        //   },
        //   navigate
        // ),
        render: (user) => {
          return <Text>{user.last_name}</Text>;
        },
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
      },
      {
        title: "Email",
        dataIndex: "user",
        key: "email",
        editable: true,
        width: "20%",
        render: ({ email }) => {
          return <a href={`mailto: ${email}`}>{email}</a>;
        },
        sorter: true,
        // ...ColumnSearchProps(
        //   "email",
        //   dispatch,
        //   setSearch,
        //   {
        //     pageSize,
        //     page,
        //   },
        //   navigate
        // ),

        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
      },

      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        sorter: true,
        width: "5%",
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
        render: (_, client) => {
          let { active } = client;

          return (
            <Space>
              <Button
                onClick={() => {
                  handleUserClientModalOpen({
                    addUserClientModalOpen: true,
                    client,
                    record,
                    isUpdate: true,
                  });
                }}
                size="small"
                type="primary"
                icon={<EditOutlined />}
              />
            </Space>
          );
        },
      },
    ],
    []
  );

  return (
    <div>
      {contextHolder}
      <Table
        size="small"
        title={() => {
          return (
            <Button
              onClick={() => {
                handleUserClientModalOpen({
                  addUserClientModalOpen: true,
                  record,
                });
              }}
              type="primary"
              icon={<PlusOutlined />}
            >
              Add new user for <strong> {record.name?.toUpperCase()}</strong>
            </Button>
          );
        }}
        scroll={{ x: 1300 }}
        loading={isFetching}
        dataSource={data?.data}
        pagination={false}
        columns={columns}
      />
    </div>
  );
}

export default React.memo(UserManagementTable);
