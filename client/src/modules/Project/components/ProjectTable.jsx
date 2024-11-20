import { Button, Space, Table, Tag, message } from "antd";
import React, { useMemo } from "react";

import {
  EditOutlined,
  EyeTwoTone,
  EyeInvisibleTwoTone,
} from "@ant-design/icons";
import { Developers, EditableCell, EditableRow } from "../../Common/components";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useLoaderData, useNavigate } from "react-router-dom";
import ProjectController from "../controllers/ProjectController";
import { HeaderTitle } from ".";
import ColumnSearchProps from "@modules/Common/components/ColumnSearchProps";
import { setSearch } from "../models/ProjectModel";

const components = {
  body: {
    row: EditableRow,
    cell: EditableCell,
  },
};

function ProjectTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tableQuery = useLoaderData();
  const queryClient = useQueryClient();

  const [messageApi, contextHolder] = message.useMessage();
  const { organization_id, id: user_id } = useSelector(
    (state) => state.login.user
  );

  const sort = useSelector((state) => state.project.sort);
  const search = useSelector((state) => state.project.search);
  const filter = useSelector((state) => state.project.filter);
  const pageSize = parseInt(tableQuery.pagination.pageSize);
  const page = parseInt(tableQuery.pagination.page);

  const QUERY_KEY = [
    "projects",
    organization_id,
    { paginate: { pageSize, page } },
    { sort },
    { search },
    { filter: { ...filter, user_id } },
  ];

  const {
    handleGetProjects,
    onTableChange,
    handleChangeIsUpdateState,
    handleModalOpen,
    handleUpdateStatus,
  } = ProjectController({
    dispatch,
    navigate,
  });
  const { data, isLoading, isFetching } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () =>
      await handleGetProjects(organization_id, {
        paginate: { pageSize, page },
        sort,
        search,
        filter: { ...filter, user_id },
      }),
    enabled: !!organization_id,
    keepPreviousData: true,
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: ({ project, organization_id, project_id }) => {
      return handleUpdateStatus(project, organization_id, project_id);
    },
    onSuccess: ([data, error]) => {
      if (error) {
        let errorMessage = error.response.data.message;
        messageApi.error(errorMessage);
      } else {
        let { active, project_id } = data;

        queryClient.setQueryData(QUERY_KEY, (prevData) => {
          let newProjectData = prevData.data.map((prev) => {
            if (prev.id === project_id) {
              return { ...prev, active };
            }

            return prev;
          });

          queryClient.invalidateQueries(["project_details"]);
          return { ...prevData, data: newProjectData };
        });
      }
    },
  });

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "project_id_text",
        key: "project_id",
        editable: true,
        sorter: true,
        width: "10%",
        ...ColumnSearchProps(
          "project_id_text",
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
      },
      {
        title: "Project Name",
        dataIndex: "name",
        key: "name",
        width: "15%",
        editable: true,
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
      },

      {
        title: "Client Name",
        dataIndex: "client",
        key: "client",
        // sorter: true,
        ...ColumnSearchProps(
          "client",
          dispatch,
          setSearch,
          {
            pageSize,
            page,
          },
          navigate
        ),
        render: (client) => client.name,
        width: "15%",
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
      },
      {
        title: "Versions",
        dataIndex: "versions",
        key: "versions",
        width: "10%",
        render: (versions) =>
          versions.map((version) => <Tag key={version.id}>{version.name}</Tag>),
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
      },
      {
        title: "Team",
        dataIndex: "team",
        key: "team",
        render: (team) => {
          team = team.map((c) => {
            return {
              id: c.id,
              first_name: c.user?.first_name,
              last_name: c.user?.last_name,
              projectRoleName: c.project_role?.name,
            };
          });

          return <Developers users={team} size="medium" />;
        },
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
      },
      {
        title: "Status",
        dataIndex: "active",
        key: "active",
        sorter: true,
        render: (active) => {
          let tagData = active
            ? { color: "red", text: "Open" }
            : { color: "green", text: "Closed" };

          return <Tag color={tagData.color}>{tagData.text}</Tag>;
        },
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
      },
      {
        title: "Date created",
        dataIndex: "createdAt",
        key: "createdAt",
        sorter: true,
        render: (dateCreated) => dateCreated,
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        sorter: true,
        width: 100,
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
        render: (_, project) => {
          let { active } = project;

          return (
            <Space>
              <Button
                onClick={() => {
                  handleChangeIsUpdateState(true, project);
                  handleModalOpen(true);
                }}
                size="small"
                type="primary"
                icon={<EditOutlined />}
              />
              <Button
                size="small"
                onClick={() => {
                  mutation.mutate({
                    project,
                    organization_id,
                    project_id: project.id,
                  });
                }}
                icon={
                  active ? (
                    <EyeTwoTone />
                  ) : (
                    <EyeInvisibleTwoTone twoToneColor="red" />
                  )
                }
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
        components={components}
        title={() => {
          return <HeaderTitle QUERY_KEY={QUERY_KEY} />;
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
    </div>
  );
}

export default React.memo(ProjectTable);
