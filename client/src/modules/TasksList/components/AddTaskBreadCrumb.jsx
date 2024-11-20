import { Breadcrumb, Dropdown, Form, Input, Typography } from "antd";
import React, { Suspense, useEffect } from "react";
import { useQueryClient } from "react-query";
// // import { Editor } from "@tinymce/tinymce-react";

import { useDispatch, useSelector } from "react-redux";
import "./styles.css";
import { setErrors } from "../models/TasksListModel";

const { Text } = Typography;

function AddTaskBreadCrumb({
  form,
  isFeedback,
  queryKey = "filter_client_project",
  showTasks = true,
}) {
  const selectedFilter = useSelector((state) => state.common.selectedFilter);
  const errors = useSelector((state) => state.taskList.errors);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const isUpdate = useSelector((state) => state.taskList.isUpdate);
  const isView = useSelector((state) => state.taskList.isView);

  const updateData = useSelector((state) => state.taskList.updateData);
  let project_id = Form.useWatch("project_id", form);
  let client_id = Form.useWatch("client_id", form);
  let module_id = Form.useWatch("module_id", form);

  const QUERY_KEY_CLIENTS_FILTER = [queryKey, showTasks];

  const state = queryClient.getQueryState(QUERY_KEY_CLIENTS_FILTER);

  client_id = isNaN(client_id) ? client_id : parseInt(client_id);
  project_id = isNaN(project_id) ? project_id : parseInt(project_id);
  module_id = isNaN(module_id) ? module_id : parseInt(module_id);

  let client = state?.data?.find((c) => c.id === client_id);
  let project = client?.children?.find((c) => c.id === project_id);
  let module = project?.children?.find((c) => c.id === module_id);

  useEffect(() => {
    let project_id, client_id, module_id;

    if (isUpdate) {
      project_id = updateData.project.id;
      client_id = updateData.client.id;
      module_id = updateData.module_id;
    } else {
      project_id = selectedFilter.projectId;
      client_id = selectedFilter.clientId;
      module_id = selectedFilter.moduleId;
    }

    form.setFieldsValue({
      project_id: project_id,
      client_id: client_id,
      module_id: module_id,
    });
  }, [selectedFilter, isUpdate, updateData]);

  const filterItem = (data) => {
    return data
      ?.filter((c) => !isNaN(c.id))
      .map(({ children, ...rest }) => ({
        ...rest,
      }));
  };

  let items = [
    {
      title: `${isView ? "Viewing" : isUpdate ? "Update" : "Add"} task`,
    },
    {
      title: (
        <Dropdown
          disabled={isUpdate}
          menu={{
            items: filterItem(state?.data),
            selectable: true,
            selectedKeys: [`${client_id}`],
            onSelect: (selected) => {
              form.setFieldValue("client_id", parseInt(selected.key));
              form.setFieldsValue({ project_id: null, module_id: null });

              dispatch(
                setErrors({
                  client_id: false,
                  project_id: true,
                  module_id: true,
                })
              );
            },
          }}
        >
          <Text
            type={errors.client_id ? "danger" : "default"}
            className={errors.client_id ? "vibrate-text" : ""}
          >
            {!isNaN(client?.id) ? client?.name : "Select Client"}
          </Text>
        </Dropdown>
      ),
    },
    {
      title: (
        <Dropdown
          disabled={isNaN(client?.id) || isUpdate}
          menu={{
            items: filterItem(client?.children),
            selectable: true,
            selectedKeys: [`${client_id}-${project_id}`],
            onSelect: (selected) => {
              let [_, project_id] = selected.key.split("-");
              form.setFieldValue("project_id", parseInt(project_id));
              form.setFieldsValue({ module_id: null });
              dispatch(setErrors({ project_id: false, module_id: true }));
            },
          }}
        >
          <Text
            type={errors.project_id ? "danger" : "default"}
            className={errors.project_id ? "vibrate-text" : ""}
          >
            {!isNaN(project?.id) ? project?.name : "Select Project"}
          </Text>
        </Dropdown>
      ),
    },
  ];

  if (!isFeedback) {
    items.push({
      title: (
        <Dropdown
          disabled={isNaN(project?.id) || isUpdate}
          menu={{
            items: filterItem(project?.children),
            selectable: true,
            selectedKeys: [`${client_id}-${project_id}-${module_id}`],
            onSelect: (selected) => {
              let [_, project_id, module_id] = selected.key.split("-");

              form.setFieldValue("module_id", parseInt(module_id));
              dispatch(setErrors({ module_id: false }));
              form.setFieldValue("team", []);
            },
          }}
        >
          <Text
            type={errors.module_id ? "danger" : "default"}
            className={errors.module_id ? "vibrate-text" : ""}
          >
            {!isNaN(module?.id) ? module?.name : "Select Module"}
          </Text>
        </Dropdown>
      ),
    });
  }

  return (
    <Suspense>
      <Breadcrumb separator=">" items={items} />
    </Suspense>
  );
}

export default AddTaskBreadCrumb;
