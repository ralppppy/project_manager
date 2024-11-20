import axios from "axios";

const API_PATH = "/api/module_list";

const ModuleListServices = () => {
  const getClientsDropdownService = async (params) => {
    try {
      let organization_id = params.organization_id;
      delete params.organization_id;
      let response = await axios.get(
        `${API_PATH}/clients_dropdown/${organization_id}`,
        {
          params,
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getProjectsDropdownService = async (params) => {
    try {
      let organization_id = params.organization_id;
      delete params.organization_id;
      let response = await axios.get(
        `${API_PATH}/projects_dropdown/${organization_id}`,
        {
          params,
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getUsersService = async (params, apiPath = "") => {
    try {
      let organization_id = params.organization_id;

      delete params.organization_id;
      let response = await axios.get(
        `${apiPath ? apiPath : API_PATH}/user_dropdown/${organization_id}`,
        {
          params,
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const updateClientsService = async (params) => {
    try {
      let organization_id = params.organization_id;
      let id = params.id;

      delete params.organization_id;
      let response = await axios.put(
        `${API_PATH}/${organization_id}/${id}`,
        params
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const createModuleService = async (data) => {
    try {
      let response = await axios.post(API_PATH, data);

      return [response.data, null];
    } catch (error) {
      console.log("createModuleService", error);
      return [null, error];
    }
  };

  const getModuleListService = async (params) => {
    try {
      let { organization_id, client_id, project_id } = params;

      delete params.organization_id;

      let response = await axios.get(
        `${API_PATH}/${organization_id}/${client_id}/${project_id}`,
        {
          params,
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const getCompletionPercentService = async ({
    module_id,
    client_id,
    project_id,
    organization_id,
    isFeedback,
  }) => {
    try {
      let response = await axios.get(
        `${API_PATH}/task_completion_percent/${organization_id}/${client_id}/${project_id}/${module_id}`,
        {
          params: { isFeedback },
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const getModuleCompletionPercentService = async ({
    module_id,
    client_id,
    project_id,
    organization_id,
  }) => {
    try {
      let response = await axios.get(
        `${API_PATH}/module_completion_percent/${organization_id}/${client_id}/${project_id}/${module_id}`
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const getTaskHoursService = async ({
    module_id,
    client_id,
    project_id,
    organization_id,
    isFeedback,
  }) => {
    try {
      let response = await axios.get(
        `${API_PATH}/task_time_total/${organization_id}/${client_id}/${project_id}/${module_id}`,
        { params: { isFeedback } }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getSingleModuleService = async ({
    module_id,
    client_id,
    project_id,
    organization_id,
  }) => {
    try {
      let response = await axios.get(
        `${API_PATH}/single/${organization_id}/${client_id}/${project_id}/${module_id}`
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const getTeamService = async ({
    module_id,
    client_id,
    project_id,
    organization_id,
  }) => {
    try {
      let response = await axios.get(
        `${API_PATH}/team/${organization_id}/${client_id}/${project_id}/${module_id}`
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const deleteModuleMemberService = async (module_team_id) => {
    try {
      let response = await axios.delete(
        `${API_PATH}/delete_team_member/${module_team_id}`
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const deleteModuleMemberProjectService = async (project_team_id) => {
    try {
      let response = await axios.delete(
        `${API_PATH}/delete_team_member_project/${project_team_id}`
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const updateModuleListService = async (data, { module_id }) => {
    try {
      let response = await axios.put(`${API_PATH}/${module_id}`, data);

      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  return {
    createModuleService,
    getClientsDropdownService,
    getProjectsDropdownService,
    updateClientsService,
    getUsersService,
    getModuleListService,
    getSingleModuleService,
    deleteModuleMemberService,
    updateModuleListService,
    deleteModuleMemberProjectService,
    getTeamService,
    getCompletionPercentService,
    getTaskHoursService,
    getModuleCompletionPercentService,
  };
};

export default ModuleListServices;
