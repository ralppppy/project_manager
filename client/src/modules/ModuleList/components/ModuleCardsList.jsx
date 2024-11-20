import { List, Space, Switch, Tooltip, Typography, message } from "antd";

import React, { useEffect } from "react";

import "./styles.css";
import { ProjectInfoCard } from "../../Common/components";
import { useDispatch, useSelector } from "react-redux";
import { ModuleListController } from "@modules/ModuleList/controllers";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  Link,
  useLoaderData,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { CheckOutlined, ClockCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

function ModuleCardsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const search = useSelector((state) => state.module.search.s);

  const { project_id, client_id } = useParams();

  const tableQuery = useLoaderData();

  const pageSize = parseInt(tableQuery?.pagination?.pageSize);
  const page = parseInt(tableQuery?.pagination?.page);

  const { handleGetModuleList, onChangeList, handleUpdateModuleData } =
    ModuleListController({
      dispatch,
      queryClient,
      navigate,
    });

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const QUERY_KEY = [
    "module_lists",
    organization_id,
    project_id,
    client_id,
    { pageSize, page },
    search?.toLowerCase(),
  ];

  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () =>
      handleGetModuleList(
        organization_id,
        project_id,
        client_id,
        { pageSize, page },
        search
      ),
    enabled: !!project_id || !!client_id || !!organization_id || !!search,
    staleTime: Infinity,
    keepPreviousData: true,
  });

  const mutation = useMutation({
    mutationFn: handleUpdateModuleData,
    onSuccess: ({ active, item }) => {
      queryClient.setQueryData(QUERY_KEY, (prevData) => {
        let newData = prevData.data.map((c) => {
          if (c.id === item.id) {
            return { ...c, active };
          }

          return c;
        });

        queryClient.invalidateQueries(["project_completion_percent"]);
        queryClient.invalidateQueries(["single_module"]);
        messageApi.open({
          type: "success",
          content: `${item.title} is set to ${active ? "active" : "completed"}`,
        });

        return { ...prevData, data: newData };
      });
    },
  });

  return (
    <div>
      {contextHolder}
      <List
        loading={isFetching}
        className="w-100"
        pagination={{
          onChange: onChangeList,
          position: "bottom",
          align: "end",
          current: parseInt(page),
          pageSize: parseInt(pageSize),
          page: parseInt(page),
          total: data?.totalData,
          showSizeChanger: true,
        }}
        grid={{
          gutter: 10,
          column: 5,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 5,
        }}
        dataSource={data?.data}
        renderItem={(item) => {
          return (
            <List.Item>
              <Link
                to={`/module-list/${item.client_id}/${item.project_id}/${item.id}`}
              >
                <ProjectInfoCard
                  footer={(item) => {
                    return (
                      <Space size={"small"} className="mt-3">
                        <Tooltip
                          title={
                            item.active
                              ? "Change to completed"
                              : "Change to active"
                          }
                        >
                          <Switch
                            onClick={(value, event) => {
                              event.preventDefault();
                              event.stopPropagation();

                              mutation.mutate({ active: value, item });
                            }}
                            checkedChildren={
                              <>
                                <ClockCircleOutlined /> Module is active
                              </>
                            }
                            unCheckedChildren={
                              <>
                                <CheckOutlined /> Module is Completed
                              </>
                            }
                            defaultChecked={item.active}
                          />
                        </Tooltip>
                      </Space>
                    );
                  }}
                  item={item}
                />
              </Link>
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default React.memo(ModuleCardsList);
