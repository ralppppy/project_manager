import { Form, message } from "antd";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Developers } from "../../Common/components";
import { useLoaderData } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ModuleListController } from "../../ModuleList/controllers";
import { TaskListController } from "../controllers";

function TaskAssingnee({ form }) {
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  const isUpdate = useSelector((state) => state.taskList.isUpdate);
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

  const tableQuery = useLoaderData();

  const pageSize = parseInt(tableQuery.pagination.pageSize);
  const page = parseInt(tableQuery.pagination.page);

  const QUERY_KEY_TASKS = [
    "tasks",
    organization_id,
    client_id,
    project_id,
    module_id,
    { pageSize, page },
  ];

  const {
    handleAddMember,
    handleRemoveMember,
    hanldeRemoveDataFromQuery,
    hanldeRemoveDataFromQuerySuccess,
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
  });

  const { mutate } = useMutation({
    mutationFn: hanldeRemoveDataFromQuery,
    onSuccess: hanldeRemoveDataFromQuerySuccess,
  });

  const MODULE_KEY = ["single_module_team", client_id, project_id, module_id];

  const { data, isFetching } = useQuery({
    queryKey: MODULE_KEY,
    queryFn: () =>
      handleGetTeam({
        client_id: client_id,
        project_id: project_id,
        module_id,
        organization_id,
      }),

    enabled: !!module_id,
    keepPreviousData: true,
    staleTime: Infinity,
  });

  const team = Form.useWatch("team", form);
  useEffect(() => {
    if (isUpdate) {
      let teamIds = updateData.team.map((c) => c.user.id);
      form.setFieldValue("team", updateData.team);
      if (data) {
        let newData = data.filter((c) => !teamIds.includes(c.user.id));
        setTeamList(newData);
      }
    } else {
      if (data) {
        setTeamList(data);
      }
    }
  }, [data, isUpdate, updateData]);

  return (
    <>
      {contextHolder}
      <Form.Item name="team">
        <Developers
          size="medium"
          users={team ? team : []}
          onClick={(data) => handleRemoveMember(data, updateData?.id, mutate)}
          allowAdd={{
            onAddSelect: handleAddMember,
            list: teamList,
          }}
        />
      </Form.Item>
    </>
  );
}

export default TaskAssingnee;
