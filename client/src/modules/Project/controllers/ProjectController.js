import {
  initialState,
  setFilter,
  setIsUpdate,
  setModalOpen,
  setProjects,
  setSort,
  setUpdateState,
} from "../models/ProjectModel";
import ProjectServices from "../services/ProjectServices";
import ModuleListServices from "../../ModuleList/services/ModuleListServices";

const ProjectController = ({
  dispatch,
  form,
  queryClient,
  messageApi,
  organization_id,
  QUERY_KEY,
  QUERY_KEY_PROJECT_DROPDOWN,
  navigate,
  isUpdate,
  setItems,
}) => {
  const {
    getProjecsService,
    getProjectRolesService,
    createProjectService,
    getProjectDetailsService,
    deleteProjectTeamMember,
    updateProjectService,
    deleteProjectVersionService,
    getProjecsDropdownService,
    updateProjectSortingService,
  } = ProjectServices();

  const { deleteModuleMemberProjectService } = ModuleListServices();

  const bulkInvalidateQueries = () => {
    queryClient.invalidateQueries(["project_summary"]);
    queryClient.invalidateQueries(["module_lists"]);
    queryClient.invalidateQueries(["module_list_users"]);

    queryClient.invalidateQueries(["tasks"]);
    queryClient.invalidateQueries(["task_completion_percent"]);
    queryClient.invalidateQueries(["task_hours"]);
    queryClient.invalidateQueries(["project_task_hours"]);

    queryClient.invalidateQueries(["departments_dashboard"]);
    queryClient.invalidateQueries(["chart_data"]);
    queryClient.invalidateQueries(["unassigned_projects"]);
    queryClient.invalidateQueries(["unassigned_tasks"]);
    queryClient.invalidateQueries(["user_projects"]);
  };
  const onTableChange = (pagination, filters, sorter, extra) => {
    switch (extra.action) {
      case "paginate":
        let { current, pageSize } = pagination;
        const queryParams = new URLSearchParams({
          page: current,
          pageSize: pageSize,
        });

        navigate(`?${queryParams.toString()}`, { replace: true });

        break;
      case "sort":
        if (sorter.order) {
          dispatch(
            setSort({
              field: sorter.field,
              order: sorter.order,
            })
          );
        } else {
          dispatch(
            setSort({
              ...initialState.sort,
            })
          );
        }

        break;

      default:
        break;
    }
  };

  const handleGetProjects = async (organization_id, pagingation) => {
    let params = { organization_id, ...pagingation };
    let [{ data }, error] = await getProjecsService(params);

    let projects = data.data.map((project) => ({
      ...project,
      key: project.id,
    }));

    return { data: projects, total: data.totalData };
  };

  const handleModalOpen = (modalOpen) => {
    dispatch(setModalOpen(modalOpen));
  };

  const formatUpdateState = (project) => {
    project = {
      ...project,
      client_id: project.client.id,
      team: project.team.map((c) => ({
        ...c,
        first_name: c.user.first_name,
        last_name: c.user.last_name,
        projectRoleName: c.project_role.name,
      })),
    };

    return project;
  };

  const handleChangeIsUpdateState = (isUpdate, project) => {
    // handleSetModalTitle(isUpdate);
    if (isUpdate) {
      dispatch(setUpdateState(formatUpdateState(project)));
    }

    dispatch(setIsUpdate(isUpdate));
  };

  const handleGetProjectRoles = async (user) => {
    let params = { organization_id: user.organization_id };
    let [{ data }, error] = await getProjectRolesService(
      params,
      "/api/project_roles/dropdown"
    );

    let users = data.map((client) => ({
      ...client,
      key: client.id,
    }));
    return users;
  };

  const handleAddTeam = ({
    usersData,
    projectRoleData,
    mutation,
    loggedInUser,
  }) => {
    let projectRoleId = form.getFieldValue("project_role_id");
    let clientId = form.getFieldValue("client_id");
    let userId = form.getFieldValue("user_id");

    if (userId && projectRoleId) {
      let userDropdownData = usersData.find((user) => user.id === userId);
      let projectRole = projectRoleData.find(
        (projectRole) => projectRole.id === projectRoleId
      );

      let prevTeam = form.getFieldValue("team");
      let newTeamData = {
        id: isUpdate ? undefined : userDropdownData.id,
        user_id: userDropdownData.id,
        project_role_id: projectRole.id,
        first_name: userDropdownData.first_name,
        last_name: userDropdownData.last_name,
        projectRoleName: projectRole.name,
        organization_id: loggedInUser.organization_id,
        client_id: clientId,
      };

      let newTeam = prevTeam ? [...prevTeam, newTeamData] : [newTeamData];

      form.setFieldsValue({
        team: newTeam,
        user_id: null,
      });
      mutation.mutate({
        usersData,
        user: userDropdownData,
        type: "remove",
      });
    }
  };

  const handleDeleteTeamMember = async (organization_id, user_team_id) => {
    let [response, error] = await deleteProjectTeamMember(
      organization_id,
      user_team_id
    );
  };

  const handleRemoveUser = async ({
    userTeam,
    usersData,
    organization_id,
    mutation,
  }) => {
    if (isUpdate) {
      queryClient.invalidateQueries(QUERY_KEY);
      bulkInvalidateQueries();
      await handleDeleteTeamMember(organization_id, userTeam.id);
      await deleteModuleMemberProjectService(userTeam.id);
    }

    let prevTeam = form.getFieldValue("team");

    let newTeam = prevTeam.filter((prev) => prev.id !== userTeam.id);

    form.setFieldsValue({
      team: newTeam,
      user_id: userTeam.id,
    });

    mutation.mutate({ usersData, user: userTeam, type: "add" });
  };

  const formatDataForUpdate = (values, project_id) => {
    //Only send the team that do not have any id
    let team = values.team
      .filter((c) => !c.id)
      .map((c) => ({ ...c, project_id }));

    //Only send the verison that do not have any id
    let versions = values.versions
      .filter((c) => !c.id)
      .map((c) => ({ ...c, project_id }));

    let data = { ...values, team, versions };

    return data;
  };

  const formatDataForCreate = (values) => {
    //Remove the id in team array to make sure that the id does not not duplicate error in database
    let team = values.team.map((c) => {
      let { id, ...rest } = c;

      return rest;
    });

    let data = { ...values, team };

    return data;
  };

  const handleUpdateSorting = async (values) => {
    let [client, error] = await updateProjectSortingService(values, {
      organization_id,
    });

    if (error) return { success: false, error };

    return { success: true, values };
  };

  const handleSuccessSort = (data) => {
    queryClient.setQueryData(QUERY_KEY_PROJECT_DROPDOWN, (prevData) => {
      const prevSortData = {};

      prevData.forEach((item) => {
        prevSortData[item.id] = item;
      });

      let newProjectData = data.values.map((newData) => {
        return { ...prevSortData[newData.id], ...newData };
      });

      let allQuery = getAllQuery(queryClient, QUERY_KEY[0]);

      allQuery.forEach((query) => {
        queryClient.invalidateQueries(query);
      });

      return newProjectData;
    });
  };

  const handleSubmit = async (values) => {
    if (isUpdate) {
      let project_id = values.id;

      let data = formatDataForUpdate(values, project_id);

      let [client, error] = await updateProjectService(data, {
        organization_id,
        project_id,
      });

      if (error) return { success: false, error };
      bulkInvalidateQueries();
      return { success: true, values: data };
    } else {
      let data = {
        ...values,
        organization_id: organization_id,
        status: 1, //Always active at first
      };

      data = formatDataForCreate(data);

      let [client, error] = await createProjectService(data);

      if (error) return { success: false, error };
      bulkInvalidateQueries();
      return { success: true, values: client };
    }
  };

  const getAllQuery = (queryClient, getQueryType = null) => {
    const queryCache = queryClient.getQueryCache();

    if (getQueryType) {
      return queryCache
        .getAll()
        .map((cache) => cache.queryKey)
        .filter((c) => c[0] === getQueryType);
    }

    return queryCache.getAll().map((cache) => cache.queryKey);
  };

  const handleSuccess = (newData) => {
    if (!newData.success) {
      let message = newData.error.response.data.message;
      messageApi.open({
        type: "error",
        content: message,
      });

      return;
    }

    let allQuery = getAllQuery(queryClient, QUERY_KEY[0]);

    allQuery.forEach((query) => {
      queryClient.invalidateQueries(query);
    });

    handleModalOpen(false);

    /**Update the  project details*/
    queryClient.invalidateQueries(["project_details"]);
  };

  const handleFilter = (type, value) => {
    dispatch(setFilter({ type, value }));
  };

  const handleGetProjectDetails = async (organization_id) => {
    let [response, error] = await getProjectDetailsService({
      organization_id,
    });

    return response.data;
  };

  const handleUpdateStatus = async (data, organization_id, project_id) => {
    data = { active: !data.active };
    let [response, error] = await updateProjectService(data, {
      organization_id,
      project_id,
    });

    return [{ ...data, project_id }, error];
  };

  const handleAddVersion = (organization_id) => {
    let name = form.getFieldValue("version_name");
    if (name) {
      let newVersionData = {
        name: name,
        organization_id,
      };
      let prevVersions = form.getFieldValue("versions");

      let newVersions = prevVersions
        ? [
            ...prevVersions.filter(
              (prevVersion) => prevVersion.name !== newVersionData.name
            ),
            newVersionData,
          ]
        : [newVersionData];

      form.setFieldsValue({
        versions: newVersions,
        version_name: null,
      });
    }
  };

  const handleRemoveVersion = async (organization_id, version, isUpdate) => {
    let prevVersions = form.getFieldValue("versions");

    if (isUpdate) {
      queryClient.invalidateQueries(QUERY_KEY);
      await deleteProjectVersionService(organization_id, version.id);
    }

    prevVersions = prevVersions.filter(
      (prevVersion) => prevVersion.name !== version.name
    );

    form.setFieldsValue({
      versions: prevVersions,
    });
  };

  const handleGetProjectsDropdown = async (organization_id) => {
    let [response, error] = await getProjecsDropdownService(organization_id);
    setItems(response.data);
    return response.data;
  };

  return {
    handleGetProjects,
    handleModalOpen,
    handleChangeIsUpdateState,
    handleGetProjectRoles,
    handleAddTeam,
    handleRemoveUser,
    handleSubmit,
    handleSuccess,
    handleFilter,
    handleGetProjectDetails,
    onTableChange,
    handleUpdateStatus,
    handleAddVersion,
    handleRemoveVersion,
    handleGetProjectsDropdown,
    handleUpdateSorting,
    handleSuccessSort,
  };
};

export default ProjectController;
