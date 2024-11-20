import React, { useState } from "react";
import { Breadcrumb, Dropdown, Skeleton, Space, Typography, theme } from "antd";
import { useQuery } from "react-query";
import { DownOutlined } from "@ant-design/icons";
import { ClientController } from "../../Client/controllers";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedFilter } from "../models/CommonModel";
import { useNavigate, useNavigation } from "react-router-dom";

const { Text } = Typography;
const { useToken } = theme;

function FilterClientProjectModule({ queryKey = "filter_client_project" }) {
  const { token } = useToken();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const pageSize = useSelector((state) => state.module.paginate.pageSize);
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );
  const { childFilterName, childModuleName, parentFilterName } = useSelector(
    (state) => state.common
  );

  //   const [selectedKeys, setSelectedKeys] = useState("");

  const selectedFilter = useSelector((state) => state.common.selectedFilter);

  const { handleGetClientsWithProjectsFilter } = ClientController({});

  const QUERY_KEY_CLIENTS_FILTER = [queryKey, true];

  //filter_client_project
  const { data, isLoading, isFetching } = useQuery({
    queryKey: QUERY_KEY_CLIENTS_FILTER,
    queryFn: () => {
      return handleGetClientsWithProjectsFilter(organization_id, true, true);
    },

    enabled: !!organization_id,
    keepPreviousData: true,
    staleTime: 10,
  });

  let selectedKeys = "";
  if (isNaN(selectedFilter.projectId)) {
    selectedKeys = selectedFilter.projectId;
  } else {
    if (isNaN(selectedFilter.moduleId)) {
      selectedKeys = selectedFilter.moduleId;
    } else {
      selectedKeys = `${selectedFilter.clientId}-${selectedFilter.projectId}-${selectedFilter.moduleId}`;
    }
  }

  let items = [
    {
      title: (
        <Dropdown
          placement="bottom"
          menu={{
            items: data,
            selectable: true,
            selectedKeys: [selectedKeys],
            onSelect: (selected) => {
              //   setSelectedKeys(selected.key);
              let parentFilterName = "";
              let childFilterName = "";
              let childModuleName = "";

              let [clientId, projectId, moduleId] = selected.key.split("-");

              //Selected is ALL
              if (selected.key === "All") {
                parentFilterName = "All";
                childFilterName = "All";

                childModuleName = "All";

                clientId = "All";
                projectId = "All";
                moduleId = "All";
              } else {
                clientId = isNaN(clientId) ? clientId : parseInt(clientId);

                projectId = isNaN(projectId)
                  ? `${clientId}-${projectId}`
                  : parseInt(projectId);

                moduleId = isNaN(moduleId)
                  ? `${clientId}-${projectId}-${moduleId}`
                  : parseInt(moduleId);

                let filterData = data.find((d) => d.id === clientId);

                parentFilterName = filterData.label;

                let { label, children } = filterData.children.find(
                  (c) => c.id === projectId
                );
                childFilterName = label;

                if (isNaN(projectId)) {
                  childModuleName = "All";
                  childFilterName = "All";
                } else {
                  childModuleName =
                    children.find((c) => c.id === moduleId)?.label || "All";
                }
              }

              let selectedFilter = {
                clientId,
                projectId,
                moduleId,
              };

              dispatch(
                setSelectedFilter({
                  parentFilterName,
                  childFilterName,
                  childModuleName,
                  selectedFilter,
                })
              );

              const queryParams = new URLSearchParams({
                page: 1,
                pageSize,
              });

              navigate(`?${queryParams.toString()}`, { replace: true });
            },
          }}
          // onOpenChange
        >
          <Space
            style={{
              cursor: "pointer",
              paddingLeft: token.paddingContentHorizontal,
              paddingRight: token.paddingContentHorizontal,
              borderRadius: token.borderRadius,
              backgroundColor: token.colorBgTextActive,
            }}
          >
            <Text>{parentFilterName}</Text>
            <DownOutlined />
          </Space>
        </Dropdown>
      ),
    },
    {
      title: <Text>{childFilterName}</Text>,
    },
    {
      title: <Text>{childModuleName || "All"}</Text>,
    },
  ];

  return isLoading ? (
    <Breadcrumb
      className="mb-2"
      items={[
        {
          title: <Skeleton.Input active={true} size={"small"} />,
        },
        {
          title: <Skeleton.Input active={true} size={"small"} />,
        },
      ]}
    />
  ) : (
    <>
      <Breadcrumb className="mb-2" items={items} />
    </>
  );
}

export default React.memo(FilterClientProjectModule);
