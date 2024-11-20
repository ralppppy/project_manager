import { Button, Form, List } from "antd";
import React from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { TaskListController } from "../controllers";
import { BranchesOutlined } from "@ant-design/icons";
import "./styles.css";

function TaskDropdownSearchList({ realSearch, form, setOpen }) {
  const { handleSearchTask } = TaskListController({});

  const project_id = Form.useWatch("project_id", form);
  const client_id = Form.useWatch("client_id", form);
  let module_id = Form.useWatch("module_id", form);

  module_id = module_id ? module_id : "All";

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  let QUERY_KEY_TASK_DROPDOWN = [
    "tasks_search_dropdown",
    organization_id,
    module_id,
    project_id,
    client_id,
    realSearch?.toLowerCase(),
  ];
  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEY_TASK_DROPDOWN,
    queryFn: () =>
      handleSearchTask({
        organization_id,
        module_id,
        project_id,
        client_id,
        search: realSearch,
      }),
    enabled: !!organization_id && !!realSearch,
    staleTime: 10,
  });

  return (
    <div style={{ maxHeight: 200, overflowY: "auto" }}>
      <List
        dataSource={data}
        loading={isFetching}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                shape="circle"
                size="small"
                type="dashed"
                onClick={() => {
                  form.setFieldValue("connected_to_id", item);
                  setOpen(false);
                }}
                icon={<BranchesOutlined />}
              />,
            ]}
          >
            <List.Item.Meta
              title={`# ${item.id}`}
              description={item.task_title}
            />
          </List.Item>
        )}
      />
    </div>
  );
}

export default React.memo(TaskDropdownSearchList);
