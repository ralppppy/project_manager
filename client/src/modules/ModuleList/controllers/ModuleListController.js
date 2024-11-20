import { setSelectedFilter } from "../../Common/models/CommonModel";
import ProjectServices from "../../Project/services/ProjectServices";
import { setCurrentSelectedData } from "../../TasksList/models/TasksListModel";
import {
  setUpdateModuleState,
  setIsUpdate,
  setModalOpen,
  setSelectedClientId,
  setSelectedProjectId,
} from "../models/ModuleListModel";
import ModuleListServices from "../services/ModuleListServices";

const ModuleListController = ({
  dispatch,
  form,
  queryClient,
  isUpdate,
  updateModuleState,
  messageApi,
  navigate,
}) => {
  const {
    getClientsDropdownService,
    getProjectsDropdownService,
    createModuleService,
    getUsersService,
    getModuleListService,
    getSingleModuleService,
    deleteModuleMemberService,
    updateModuleListService,
    getCompletionPercentService,
    getTeamService,
    getTaskHoursService,
    getModuleCompletionPercentService,
  } = ModuleListServices();

  const { getProjectSummaryService, getProjectCompletionService } =
    ProjectServices();

  const onChangeList = (page, pageSize, search) => {
    const queryParams = new URLSearchParams({
      page,
      pageSize,
    });
    navigate(`?${queryParams.toString()}`, { replace: true });
  };

  const handleGetModuleList = async (
    organization_id,
    project_id,
    client_id,
    paginate,
    search
  ) => {
    let params = {
      organization_id,
      project_id,
      client_id,
      paginate,
      search,
    };

    let [{ data }, error] = await getModuleListService(params);

    return data;
  };

  const formatDataForCreate = (values) => {
    let team = values.team.map((c) => {
      return {
        project_team_id: c.project_team_id,
        user_id: c.user_id,
        project_id: values.project_id,
        client_id: values.client_id,
        project_role_id: c.project_role_id,
        organization_id: c.organization_id,
      };
    });
    let data = { ...values, team };
    return data;
  };

  const formatDataForUpdate = (values) => {
    //Remove the id in team array to make sure that the id does not not duplicate error in database

    let team = values.team
      .map((c) => {
        if (!c.module_team_id) {
          return {
            project_team_id: c.project_team_id,
            user_id: c.user_id,
            module_id: values.id,
            client_id: values.client_id,
            project_id: values.project_id,
            project_role_id: c.project_role_id,
            organization_id: c.organization_id,
          };
        }
        return null; // Return null for the elements where c.module_team_id is truthy
      })
      .filter(Boolean);
    let data = { ...values, organization_id: 1, team };
    return data;
  };

  const clearModuleModalCache = () => {
    let QUERY_KEY_PROJECTS = ["projects_dropdown"];
    let QUERY_KEY_CLIENTS = ["clients_dropdown"];
    let QUERY_KEY_USERS = ["module_list_users"];
    queryClient.removeQueries({ queryKey: QUERY_KEY_PROJECTS });
    queryClient.removeQueries({ queryKey: QUERY_KEY_CLIENTS });
    queryClient.removeQueries({ queryKey: QUERY_KEY_USERS });
  };

  const handleModalOpen = (modalOpen, selectedFilter = null) => {
    dispatch(setModalOpen(modalOpen));
    if (modalOpen === false) {
      clearModuleModalCache();
      dispatch(setIsUpdate(modalOpen));
      dispatch(setSelectedProjectId(selectedFilter.projectId));
      dispatch(setSelectedClientId(selectedFilter.clientId));
    }
  };

  const handleOnChangeClient = (values) => {
    let key = Object.keys(values)[0];

    if (key === "client_id") {
      form.setFieldsValue({
        project_id: "",
        user_project_id: "",
        team: [],
        client_id: values[key],
      });
      dispatch(setSelectedProjectId(0));
      dispatch(setSelectedClientId(values[key]));

      return;
    }
    if (key === "project_id") {
      form.setFieldsValue({
        user_project_id: "",
        team: [],
      });
      dispatch(setSelectedProjectId(values[key]));
      return;
    }
  };

  const handleShowUpdateModal = async (item, organization_id) => {
    let [response, error] = await getSingleModuleService({
      module_id: item.id,
      client_id: item.client_id,
      project_id: item.project_id,
      organization_id,
    });

    if (error) return;
    let data = formatSingleModuleData(response.data);

    handleModalOpen(true);
    dispatch(setIsUpdate(true));
    dispatch(setUpdateModuleState(data));
    dispatch(setSelectedClientId(data.project.client_id));
    dispatch(setSelectedProjectId(data.project.id));
  };

  const handleGetUsers = async (user, project_id, updateModuleState) => {
    let excludeUsers = [];
    if (isUpdate) {
      let { team } = updateModuleState;

      team.forEach((user) => {
        excludeUsers.push(user.user_id);
      });
    }

    let params = {
      organization_id: user.organization_id,
      project_id,
      excludeUsers,
    };

    if (isNaN(project_id)) return [];
    let [{ data }, error] = await getUsersService(params, "");

    let users = data[0]?.teams_users;
    if (!users) return users;

    users = users.map((prev) => {
      return {
        project_team_id: prev.id,
        user_id: prev.user_id,
        first_name: prev.user.first_name,
        last_name: prev.user.last_name,
        projectRoleName: prev.project_role.name,
        project_role_id: prev.project_role_id,
      };
    });
    return users;
  };

  const handleGetClients = async (user) => {
    let params = {
      organization_id: user.organization_id,
    };
    let [{ data }, error] = await getClientsDropdownService(params);

    let clients = data.map((client) => ({
      ...client,
      key: client.id,
    }));
    return clients;
  };

  const handleGetProjects = async (user, client_id) => {
    let params = { organization_id: user.organization_id, client_id };
    let [{ data }, error] = await getProjectsDropdownService(params);
    let projects = data.map((project) => ({
      ...project,
      key: project.id,
    }));

    return projects;
  };

  const handleAddTeam = ({ usersData, mutation, loggedInUser }) => {
    let user_id = form.getFieldValue("user_id");

    if (user_id) {
      let userDropdownData = usersData.find((user) => user.user_id === user_id);

      let prevTeam = form.getFieldValue("team");

      let newTeamData = {
        user_id: userDropdownData.user_id,
        project_team_id: userDropdownData.project_team_id,
        first_name: userDropdownData.first_name,
        last_name: userDropdownData.last_name,
        projectRoleName: userDropdownData.projectRoleName,
        organization_id: loggedInUser.organization_id,
        project_role_id: userDropdownData.project_role_id,
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

  const handleDeleteModuleMember = async (module_team_id) => {
    let [response, error] = await deleteModuleMemberService(module_team_id);
  };

  const handleRemoveUser = async ({ userTeam, usersData, mutation }) => {
    if (isUpdate) {
      queryClient.invalidateQueries(["module_lists"]);
      queryClient.invalidateQueries(["module_list_users"]);
      queryClient.invalidateQueries([
        "single_module",
        `${updateModuleState.id}`,
      ]);

      await handleDeleteModuleMember(userTeam.module_team_id);
    }

    let prevTeam = form.getFieldValue("team");
    let newTeam = prevTeam.filter((prev) => prev.user_id !== userTeam.user_id);
    form.setFieldsValue({
      team: newTeam,
      user_id: userTeam.user_id,
    });
    mutation.mutate({ usersData, user: userTeam, type: "add" });
  };

  const handleSubmit = async (data) => {
    if (isUpdate) {
      let module_id = data.id;

      data = formatDataForUpdate(data);

      let [modules, error] = await updateModuleListService(data, {
        module_id,
      });
      queryClient.invalidateQueries(["single_module", module_id]);

      if (error) return { success: false, error };
      return { success: true, values: modules };
    } else {
      data = {
        ...data,
        organization_id: 1,
      };

      data = formatDataForCreate(data);

      let [modules, error] = await createModuleService(data);

      if (error) return { success: false, error };
      return { success: true, values: modules };
    }
  };

  const handleSuccess = (newData, selectedFilter) => {
    if (!newData.success) {
      let message = newData.error.response.data.message;
      messageApi.open({
        type: "error",
        content: message,
      });

      return;
    }

    handleModalOpen(false, selectedFilter);

    queryClient.invalidateQueries(["module_lists"]);
    queryClient.invalidateQueries(["filter_client_project", true]);
  };

  const handleGetProjectSummaryData = async ({
    client_id,
    project_id,
    organization_id,
  }) => {
    let [{ data }, error] = await getProjectSummaryService({
      organization_id,
      client_id,
      project_id,
    });

    let teams_users = data.teams_users.map((d) => ({
      id: d.id,
      first_name: d.user.first_name,

      last_name: d.user.last_name,
      projectRoleName: d.project_role.name,
    }));

    data = { ...data, teams_users };

    return data;
  };
  const handleGetProjectCompletionPercent = async ({
    client_id,
    project_id,
    organization_id,
  }) => {
    let [{ data }, error] = await getProjectCompletionService({
      organization_id,
      client_id,
      project_id,
    });

    return data;
  };

  const formatSingleModuleData = (data, module_id) => {
    //If module_id is isNaN meaning the user selected All as filter for module
    if (isNaN(module_id)) {
      let team = data.team.map((t) => {
        let id, user, first_name, last_name, projectRoleName, project_role_id;

        if (t.project_team) {
          id = t.project_team.id;
          user = t.project_team.user;
          first_name = t.project_team.user.first_name;
          last_name = t.project_team.user.last_name;
          projectRoleName = t.project_team.project_role.name;
          project_role_id = t.project_team.project_role.id;
        } else {
          id = t.id;
          user = t.user;
          first_name = t.user.first_name;
          last_name = t.user.last_name;
          projectRoleName = t.project_role.name;
          project_role_id = t.project_role.id;
        }
        return {
          id,
          module_team_id: t.id,
          user_id: user.id,
          project_team_id: id,
          first_name,
          last_name,
          projectRoleName,
          project_role_id,
        };
      });

      return { ...data, team };
    } else {
      let team = data.team.map((t) => {
        let id, user, first_name, last_name, projectRoleName, project_role_id;

        if (t.project_team) {
          id = t.project_team.id;
          user = t.project_team.user;
          first_name = t.project_team.user.first_name;
          last_name = t.project_team.user.last_name;
          projectRoleName = t.project_team.project_role.name;
          project_role_id = t.project_team.project_role.id;
        } else {
          id = t.id;
          user = t.user;
          first_name = t.user.first_name;
          last_name = t.user.last_name;
          projectRoleName = t.project_role.name;
          project_role_id = t.project_role.id;
        }

        return {
          id,
          first_name,
          last_name,
          projectRoleName,
          user_id: user.id,
          project_team_id: id,
          project_role_id,
        };
      });

      return { ...data, team };
    }
  };

  const handleGetSinlgeModuleData = async ({
    module_id,
    client_id,
    project_id,
    organization_id,
  }) => {
    let [response, error] = await getSingleModuleService({
      module_id,
      client_id,
      project_id,
      organization_id,
    });

    let data = response.data
      ? formatSingleModuleData(response.data, module_id)
      : undefined;

    return data;
  };

  const formatTeam = (team) => {
    //organization_id:integer,project_id:integer,client_id:integer,project_role_id:integer,user_id:integer

    return team?.map((c) => {
      return {
        ...c,
        first_name: c?.user?.first_name,
        last_name: c?.user?.last_name,
        projectRoleName: c?.project_role?.name,
      };
    });
  };
  const handleGetTeam = async ({
    module_id,
    client_id,
    project_id,
    organization_id,
  }) => {
    let [response, error] = await getTeamService({
      module_id,
      client_id,
      project_id,
      organization_id,
    });

    if (error) return error;

    let data = formatTeam(response.data);
    return data;

    // let data = response.data
    //   ? formatTeamData(response.data, module_id)
    //   : undefined;
  };

  const handleGetCompletionPercent = async ({
    module_id,
    client_id,
    project_id,
    organization_id,
    isFeedback,
  }) => {
    let [response, error] = await getCompletionPercentService({
      module_id,
      client_id,
      project_id,
      organization_id,
      isFeedback,
    });

    return response;
  };
  const handleGetModuleCompletionPercent = async ({
    module_id,
    client_id,
    project_id,
    organization_id,
  }) => {
    let [response, error] = await getModuleCompletionPercentService({
      module_id,
      client_id,
      project_id,
      organization_id,
    });

    return response;
  };
  const handleGetTaskHours = async ({
    module_id,
    client_id,
    project_id,
    organization_id,
    isFeedback,
  }) => {
    let [response, error] = await getTaskHoursService({
      module_id,
      client_id,
      project_id,
      organization_id,
      isFeedback,
    });

    return response;
  };

  const handleUpdateModuleData = async ({ active, item }) => {
    let [modules, error] = await updateModuleListService(
      { active },
      {
        module_id: item.id,
      }
    );

    return { active, item };
  };

  const handleTaskListFilterChange = ({
    filterState,
    client_id,
    project_id,
    module_id,
  }) => {
    if (filterState) {
      let filterData = filterState.find((c) => {
        return `${c.id}` === `${client_id}`;
      });

      let project = filterData?.children?.find((c) => {
        return `${c.id}` === `${project_id}`;
      });

      if (project) {
        // If project selection filter is all
        if (isNaN(project_id)) {
          dispatch(
            setSelectedFilter({
              parentFilterName: filterData.name,
              childFilterName: "All", //if projected selected is ALL,
              childModuleName: "All",
              selectedFilter: {
                clientId: filterData.id,
                projectId: project.id, //if projected selected is ALL
                moduleId: null,
              },
            })
          );
        } else {
          let moduleId = "";

          if (isNaN(module_id)) {
            moduleId = `${client_id}-${project_id}-${module_id}`;
          } else {
            moduleId = `${module_id}`;
          }

          let childModuleName = "All";

          dispatch(
            setSelectedFilter({
              parentFilterName: filterData.name,
              childFilterName: project.name,
              childModuleName: childModuleName,
              selectedFilter: {
                clientId: filterData.id,
                projectId: project.id, //if projected selected is ALL
                moduleId: moduleId,
              },
            })
          );
        }
      } else {
        dispatch(
          setSelectedFilter({
            parentFilterName: "All",
            childFilterName: "All", //if projected selected is ALL,
            childModuleName: "All",
            selectedFilter: {
              clientId: filterData?.id,
              projectId: null, //if projected selected is ALL
              moduleId: null,
            },
          })
        );
      }
    }
  };

  return {
    handleShowUpdateModal,
    handleModalOpen,
    handleSubmit,
    handleSuccess,
    handleGetClients,
    handleGetProjects,
    handleAddTeam,
    handleRemoveUser,
    handleGetUsers,
    handleOnChangeClient,
    handleGetModuleList,
    handleGetProjectSummaryData,
    handleGetSinlgeModuleData,
    onChangeList,
    handleGetTeam,
    handleGetCompletionPercent,
    handleGetTaskHours,
    handleUpdateModuleData,
    handleGetModuleCompletionPercent,
    handleGetProjectCompletionPercent,
    handleTaskListFilterChange,
  };
};

export default ModuleListController;
