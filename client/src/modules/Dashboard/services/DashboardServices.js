import axios from "axios";

const API_PATH = "/api/dashboard";

const DashboardServices = () => {
  const getChartData = async ({ organization_id }) => {
    try {
      let response = await axios.get(
        `${API_PATH}/chart_data/${organization_id}`
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const getUnassignedProjects = async ({ organization_id }) => {
    try {
      let response = await axios.get(
        `${API_PATH}/unassigned_projects/${organization_id}`
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const getUnassignedTasks = async ({ organization_id }) => {
    try {
      let response = await axios.get(
        `${API_PATH}/unassigned_tasks/${organization_id}`
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getTasklistPopover = async ({
    organization_id,
    user_id,
    project_id,
  }) => {
    try {
      let response = await axios.get(
        `${API_PATH}/task_list_popover/${organization_id}/${user_id}/${project_id}`
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const getUserProjects = async ({ organization_id, user_id }) => {
    try {
      let response = await axios.get(
        `${API_PATH}/user_projects/${organization_id}/${user_id}`
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getDashboardUsers = async ({ organization_id }) => {
    try {
      let response = await axios.get(`${API_PATH}/${organization_id}`);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getTasksStatusWithCount = async ({
    organization_id,
    selectedFilter,
    isFeedback,
  }) => {
    try {
      let response = await axios.get(
        `/api/tasks_status/tasks_status_with_count/${organization_id}`,
        {
          params: { selectedFilter, isFeedback },
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  return {
    getTasksStatusWithCount,
    getDashboardUsers,
    getUserProjects,
    getUnassignedTasks,
    getUnassignedProjects,
    getChartData,
    getTasklistPopover,
  };
};

export default DashboardServices;
