import axios from "axios";

const API_PATH = "/api/projects";

const ProjectServices = () => {
  const getProjectSummaryService = async ({
    organization_id,
    client_id,
    project_id,
  }) => {
    try {
      let response = await axios.get(
        `${API_PATH}/project_summary/${organization_id}/${client_id}/${project_id}`
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const getProjectCompletionService = async ({
    organization_id,
    client_id,
    project_id,
  }) => {
    try {
      let response = await axios.get(
        `${API_PATH}/project_completion_percent/${organization_id}/${client_id}/${project_id}`
      );
      return [response.data, null];
    } catch (error) {
      console.log(error);
      return [null, error];
    }
  };

  const getProjecsService = async (params) => {
    try {
      let organization_id = params.organization_id;

      delete params.organization_id;
      let response = await axios.get(`${API_PATH}/${organization_id}`, {
        params,
      });
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const getProjecsDropdownService = async (organization_id) => {
    try {
      let response = await axios.get(
        `${API_PATH}/project_dropdown/${organization_id}`
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getProjectDetailsService = async (params, apiPath = "") => {
    try {
      let organization_id = params.organization_id;

      let response = await axios.get(
        `${API_PATH}/project_details/${organization_id}`
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getProjectRolesService = async (params, apiPath = "") => {
    try {
      let organization_id = params.organization_id;

      delete params.organization_id;
      let response = await axios.get(
        `${apiPath ? apiPath : API_PATH}/${organization_id}`,
        {
          params,
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const deleteProjectTeamMember = async (organization_id, user_team_id) => {
    try {
      let response = await axios.delete(
        `${API_PATH}/delete_team_member/${organization_id}/${user_team_id}`
      );

      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const deleteProjectVersionService = async (
    organization_id,
    project_version_id
  ) => {
    try {
      let response = await axios.delete(
        `${API_PATH}/delete_project_version/${organization_id}/${project_version_id}`
      );

      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const createProjectService = async (data) => {
    try {
      let response = await axios.post(API_PATH, data);

      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const updateProjectService = async (
    data,
    { organization_id, project_id }
  ) => {
    try {
      let response = await axios.put(
        `${API_PATH}/${organization_id}/${project_id}`,
        data
      );

      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const updateProjectSortingService = async (data, { organization_id }) => {
    try {
      let response = await axios.put(
        `${API_PATH}/update_sorting/${organization_id}`,
        data
      );

      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  return {
    getProjectDetailsService,
    getProjectRolesService,
    deleteProjectTeamMember,
    getProjecsService,
    createProjectService,
    updateProjectService,
    deleteProjectVersionService,
    getProjecsDropdownService,
    updateProjectSortingService,
    getProjectSummaryService,
    getProjectCompletionService,
  };
};

export default ProjectServices;
