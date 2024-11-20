import { Form, Table, message } from "antd";
import React, { Suspense, useMemo } from "react";
import { EditableCell, EditableRow } from "../../Common/components";
import { HolidayController } from "../controllers";
import { useDispatch, useSelector } from "react-redux";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";

import ColumnSearchProps from "@modules/Common/components/ColumnSearchProps";
import { setSearch } from "../models/HolidayModel";
import { TableHeader } from "../components";

const components = {
  body: {
    row: EditableRow,
    cell: EditableCell,
  },
};

function HolidayTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tableQuery = useLoaderData();
  const queryClient = useQueryClient();

  // const [messageApi, contextHolder] = message.useMessage();
  const { organization_id, id: user_id } = useSelector(
    (state) => state.login.user
  );
  const [messageApi, contextHolder] = message.useMessage();

  const sort = useSelector((state) => state.holiday.sort);
  const search = useSelector((state) => state.holiday.search);
  const pageSize = parseInt(tableQuery.pagination.pageSize);
  const page = parseInt(tableQuery.pagination.page);

  const QUERY_KEY = [
    "holiday",
    organization_id,
    { paginate: { pageSize, page } },
    { sort },
    { search },
  ];
  const { handleGetHolidays, onChangeList } = HolidayController({
    dispatch,
    navigate,
    QUERY_KEY,
    messageApi,
    queryClient,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () =>
      handleGetHolidays(organization_id, {
        paginate: { pageSize, page },
        sort,
        search,
      }),
    enabled: !!organization_id,
    keepPreviousData: true,
    staleTime: Infinity,
  });

  const [form] = Form.useForm();

  const columns = useMemo(
    () => [
      //   {
      //     title: "ID",
      //     dataIndex: "holiday_id_text",
      //     key: "holiday_id_text",
      //     sorter: true,
      //     width: "10%",
      //     ...ColumnSearchProps(
      //       "holiday_id_text",
      //       dispatch,
      //       setSearch,
      //       {
      //         pageSize,
      //         page,
      //       },
      //       navigate
      //     ),
      //     shouldCellUpdate: (record, prev) =>
      //       JSON.stringify(record) !== JSON.stringify(prev),

      //     onCell: (record) => ({
      //       record,
      //       dataIndex: "holiday_id_text",
      //       title: "ID",
      //     }),
      //   },
      {
        title: "ID",
        dataIndex: "holiday_id_text",
        key: "holiday_id_text",
        width: "10%",
        sorter: true,
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
      },
      {
        title: "Instruction",
        dataIndex: "instruction",
        key: "instruction",
        width: "20%",
        sorter: true,
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
      },
      {
        title: "Holiday Type",
        dataIndex: "holiday_type_id",
        key: "holiday_type_id",
        width: "15%",
        sorter: true,
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
      },

      {
        title: "Assigned To",
        dataIndex: "team",
        key: "team",
        width: "10%",
        sorter: true,
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
      },

      {
        title: "Date Created",
        dataIndex: "status",
        key: "status",
        width: "10%",
        sorter: true,
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: "10%",
        sorter: true,
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
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
          return <TableHeader />;
        }}
        scroll={{ x: 1300 }}
        loading={isFetching}
        dataSource={data?.data}
        columns={columns}
        // onChange={onTableChange}
        // expandable={{
        //   expandedRowRender: (record) => <Suspense fallback={<></>}></Suspense>,
        //   columnWidth: "1%",
        // }}
        pagination={{
          onChange: onChangeList,
          position: ["bottomRight"],
          hideOnSinglePage: true,
          current: page,
          pageSize: pageSize,
          page: page,
          total: data?.totalData,
        }}
      />
    </div>
  );
}

export default HolidayTable;
