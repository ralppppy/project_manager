import { Button, Checkbox, Col, Form, Row, Space, message } from "antd";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Developers } from "../../Common/components";
import { useLoaderData, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ModuleListController } from "../../ModuleList/controllers";
import { TaskListController } from "../controllers";
import { SaveOutlined } from "@ant-design/icons";

function TaskAssingnee({ form, isDashboard, isFeedback }) {
  // const { module_id, client_id, project_id } = useParams();
  const [dataReady, setDataReady] = useState(false);
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  const isUpdate = useSelector((state) => state.taskList.isUpdate);
  const isView = useSelector((state) => state.taskList.isView);
  const addedMember = useSelector((state) => state.taskList.addedMember);
  const updateData = useSelector((state) => state.taskList.updateData);

  const dispatch = useDispatch();
  let project_id = Form.useWatch("project_id", form);
  let client_id = Form.useWatch("client_id", form);
  let module_id = Form.useWatch("module_id", form);

  client_id = isNaN(client_id) ? client_id : parseInt(client_id);
  project_id = isNaN(project_id) ? project_id : parseInt(project_id);
  module_id = isNaN(module_id) ? module_id : parseInt(module_id);

  const [teamList, setTeamList] = useState([]);

  const { handleGetTeam } = ModuleListController({
    dispatch,
  });

  const { generateTasksQueryKey } = TaskListController({});

  const filters = useSelector((state) => state.taskList.filters);
  const taskTitleSearch = useSelector(
    (state) => state.taskList.taskTitleSearch
  );

  const tableQuery = useLoaderData();

  const pageSize = parseInt(tableQuery.pagination.pageSize);
  const page = parseInt(tableQuery.pagination.page);
  const isEmployee = useSelector((state) => state.login.user.is_employee);

  module_id = updateData.is_feedback || !isEmployee ? "All" : module_id;

  const selectedFilter = useSelector((state) => state.common.selectedFilter);
  const {
    module_id: modId,
    project_id: projId,
    client_id: clientId,
  } = useParams();

  const {
    client_id: clientIdTask,
    project_id: projectIdTask,
    module_id: moduleIdTask,
  } = generateTasksQueryKey({ isDashboard, isFeedback }, selectedFilter, {
    modId,
    projId,
    clientId,
  });
  const QUERY_KEY_TASKS = [
    "tasks",
    organization_id,
    clientIdTask,
    projectIdTask,
    moduleIdTask,
    { pageSize, page },
    filters,
    taskTitleSearch,
    isFeedback,
  ];

  const MODULE_TEAM_KEY = [
    "single_module_team",
    client_id,
    project_id,
    module_id,
  ];

  const modalOpen = useSelector((state) => state.taskList.modalOpen);

  const {
    handleAddMember,
    handleUpdateTeam,
    handleRemoveMember,
    handleUpdateMemberOnUpdate,
  } = TaskListController({
    dispatch,
    teamList,
    setTeamList,
    form,
    organization_id,
    isUpdate,
    messageApi,
    updateData,
    QUERY_KEY_TASKS,
    queryClient,
    MODULE_TEAM_KEY,
    isView,
  });

  const { data, isFetching } = useQuery({
    queryKey: MODULE_TEAM_KEY,
    queryFn: () =>
      handleGetTeam({
        client_id: client_id,
        project_id: project_id,
        module_id,
        organization_id,
      }),

    enabled:
      !!client_id && !!project_id && modalOpen && !(!isEmployee && !isUpdate),
    keepPreviousData: true,
    staleTime: Infinity,
  });

  const team = form.getFieldValue("team");

  const { mutate } = useMutation({
    mutationFn: handleAddMember,
  });

  const { mutate: removeMemberMutate } = useMutation({
    mutationFn: handleRemoveMember,
  });

  const { mutate: updateSetMemeberMutate } = useMutation({
    mutationFn: handleUpdateMemberOnUpdate,
  });

  useEffect(() => {
    if (isUpdate && !isView && !isFetching) {
      if (data) {
        let teamIds = updateData.team.map((c) => c.user.id);

        let newData = data.filter((c) => !teamIds.includes(c.user.id));
        updateSetMemeberMutate(newData);
      }
    }
  }, [isUpdate, updateData, data, isFetching]);

  useEffect(() => {
    if (updateData && data && !isFetching) {
      setDataReady(true);
    }
  }, [updateData, data, isFetching]);

  useEffect(() => {
    if (dataReady && isView && !isFetching) {
      let teamIds = updateData.team.map((c) => c.user.id);

      let newData = data.filter((c) => !teamIds.includes(c.user.id));
      updateSetMemeberMutate(newData);
    }
  }, [dataReady, isView, isFetching]);

  useEffect(() => {
    if (isUpdate) {
      form.setFieldValue("team", updateData.team);
    }
  }, [isUpdate, updateData]);

  // if (!isEmployee && !isUpdate) {
  //   return "WOW";
  // }

  return (
    <>
      {contextHolder}

      <Form.Item name="team">
        <Space size={"small"}>
          <Developers
            size="medium"
            isLoading={isFetching}
            users={team ? team : []}
            onClick={(data) => {
              if (isEmployee) {
                removeMemberMutate({ data, task_id: updateData.id });
              }
            }}
            allowAdd={
              isEmployee
                ? {
                    onAddSelect: mutate,
                    list: data || [],
                  }
                : false
            }
          />
          {isView && addedMember && (
            <Button
              onClick={() => {
                let values = {
                  team: form.getFieldValue("team"),
                  client_id: client_id,
                  project_id: project_id,
                  module_id,
                };
                handleUpdateTeam({
                  values,
                  task_id: updateData.id,
                  additionalData: {
                    organization_id,
                  },
                });
              }}
              shape="circle"
              icon={<SaveOutlined />}
            />
          )}
        </Space>
      </Form.Item>
    </>
  );
}

export default TaskAssingnee;
