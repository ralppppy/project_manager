import React from "react";
import { Table, message } from "antd";

import { TableHeader } from ".";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ExactPlacetableController } from "../controllers";
import { useLoaderData, useNavigate } from "react-router-dom";
import { EditableCell, EditableRow } from "@modules/Common/components";
import { setSearch } from "../models/ExactPlaceTableModel";
import ColumnSearchProps from "@modules/Common/components/ColumnSearchProps";

function ExactPlaceTable({
  HeaderComponent,
  ModalFormComponent,
  queryKey,
  apiPath,
  columns: defaultColumns,
  filter = { active: true },
  onAfterSubmit,
  modalTitle = "Title here",
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tableQuery = useLoaderData();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const user = useSelector((state) => state.login.user);
  const sort = useSelector((state) => state.table.sort);
  const search = useSelector((state) => state.table.search);
  const pageSize = parseInt(tableQuery.pagination.pageSize);
  const page = parseInt(tableQuery.pagination.page);

  let QUERY_KEY = [
    queryKey,
    user.organization_id,
    { paginate: { pageSize, page } },
    { sort },
    { search },
    { filter },
  ];

  const {
    handleGetData,
    onTableChange,
    handleUpdate,
    handleModalOpen,
    handleUpdateStateOnSuccess,
  } = ExactPlacetableController({
    dispatch,
    navigate,
    queryClient,
    QUERY_KEY,
    apiPath,
    messageApi,
  });

  defaultColumns = defaultColumns(handleModalOpen).map((defaultColumn) => {
    if (defaultColumn.columnSearchProps) {
      return {
        ...defaultColumn,
        ...ColumnSearchProps(
          defaultColumn.dataIndex,
          dispatch,
          setSearch,
          {
            pageSize,
            page,
          },
          navigate
        ),
      };
    }

    return { ...defaultColumn, handleModalOpen };
  });

  const { mutate } = useMutation({
    mutationFn: handleUpdate,
    onSuccess: handleUpdateStateOnSuccess,
  });

  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () =>
      handleGetData(user, {
        paginate: { pageSize, page },
        sort,
        search,
        filter,
      }),
    enabled: !!user.organization_id,
    keepPreviousData: true,
    staleTime: Infinity,
  });

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,

        handleSave: mutate,
      }),
    };
  });

  return (
    <>
      {contextHolder}
      <Table
        components={components}
        title={() => {
          return (
            <TableHeader
              messageApi={messageApi}
              QUERY_KEY={QUERY_KEY}
              HeaderComponent={HeaderComponent(handleModalOpen)}
              ModalFormComponent={ModalFormComponent}
              apiPath={apiPath}
              onAfterSubmit={onAfterSubmit}
              modalTitle={modalTitle}
              mutateTableData={mutate}
            />
          );
        }}
        scroll={{ x: 1300 }}
        loading={isFetching}
        dataSource={data?.data}
        columns={columns}
        onChange={onTableChange}
        pagination={{
          position: ["bottomRight"],
          hideOnSinglePage: true,
          current: page,
          pageSize: pageSize,
          page: page,
          total: data?.total,
        }}
      />
    </>
  );
}

export default React.memo(ExactPlaceTable);
