import { Form, Table, message } from "antd";
import React, { Suspense, useMemo } from "react";
import { EditableCell, EditableRow } from "../../Common/components";
import { AddUserClientModal, ClientUserManagementTable, TableHeader } from ".";
import { ClientController } from "../controllers";
import { useDispatch, useSelector } from "react-redux";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";

import ColumnSearchProps from "@modules/Common/components/ColumnSearchProps";
import { setSearch } from "../models/ClientModel";

const components = {
  body: {
    row: EditableRow,
    cell: EditableCell,
  },
};

function ClientTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tableQuery = useLoaderData();
  const queryClient = useQueryClient();

  // const [messageApi, contextHolder] = message.useMessage();
  const { organization_id, id: user_id } = useSelector(
    (state) => state.login.user
  );
  const [messageApi, contextHolder] = message.useMessage();

  const sort = useSelector((state) => state.client.sort);
  const search = useSelector((state) => state.client.search);
  const pageSize = parseInt(tableQuery.pagination.pageSize);
  const page = parseInt(tableQuery.pagination.page);

  const QUERY_KEY = [
    "clients",
    organization_id,
    { paginate: { pageSize, page } },
    { sort },
    { search },
  ];
  const {
    handleGetClients,
    onTableChange,
    handleUpdateClient,
    handleUpdateStateOnSuccess,
  } = ClientController({
    dispatch,
    navigate,
    QUERY_KEY,
    messageApi,
    queryClient,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () =>
      handleGetClients(organization_id, {
        paginate: { pageSize, page },
        sort,
        search,
      }),
    enabled: !!organization_id,
    keepPreviousData: true,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: handleUpdateClient,
    onSuccess: handleUpdateStateOnSuccess,
  });

  const [form] = Form.useForm();

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "client_id_text",
        key: "client_id_text",
        editable: true,
        sorter: true,
        width: "10%",
        ...ColumnSearchProps(
          "client_id_text",
          dispatch,
          setSearch,
          {
            pageSize,
            page,
          },
          navigate
        ),
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),

        onCell: (record) => ({
          record,
          editable: true,
          dataIndex: "client_id_text",
          title: "ID",

          handleSave: mutate,
        }),
      },
      {
        title: "Client Name",
        dataIndex: "name",
        key: "name",
        editable: true,
        width: "15%",
        sorter: true,
        ...ColumnSearchProps(
          "name",
          dispatch,
          setSearch,
          {
            pageSize,
            page,
          },
          navigate
        ),
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
        onCell: (record) => ({
          record,
          editable: true,
          dataIndex: "name",
          title: "Client Name",

          handleSave: mutate,
        }),
      },
      {
        title: "Open Projects",
        dataIndex: "open_projects",
        key: "open_projects",
        width: "10%",
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
      },
      {
        title: "Closed Projects",
        dataIndex: "closed_projects",
        key: "closed_projects",
        width: "10%",
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
      },
    ],
    []
  );

  return (
    <div>
      {contextHolder}
      <Table
        components={components}
        title={() => {
          return <TableHeader QUERY_KEY={QUERY_KEY} />;
        }}
        scroll={{ x: 1300 }}
        loading={isFetching}
        dataSource={data?.data}
        columns={columns}
        onChange={onTableChange}
        expandable={{
          expandedRowRender: (record) => (
            <Suspense fallback={<></>}>
              <ClientUserManagementTable form={form} record={record} />
            </Suspense>
          ),
          columnWidth: "1%",
        }}
        pagination={{
          position: ["bottomRight"],
          hideOnSinglePage: true,
          current: page,
          pageSize: pageSize,
          page: page,
          total: data?.total,
        }}
      />
      <Suspense fallback={<></>}>
        <AddUserClientModal form={form} />
      </Suspense>
    </div>
  );
}

export default ClientTable;
