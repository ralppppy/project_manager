import axios from "axios";

const GanttChartServices = () => {
  const getSummary = async ({ organization_id, clientId, projectId }) => {
    try {
      let response = await axios.get(
        `/api/gantt_chart/summary/${organization_id}/${clientId}/${projectId}`
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getGanttChartResources = async ({
    organization_id,
    clientId,
    projectId,
    startDate,
    endDate,
    modulesDropdownFilter,
  }) => {
    try {
      let response = await axios.get(
        `/api/module_list/gantt_chart/${organization_id}/${clientId}/${projectId}`,
        {
          params: {
            startDate,
            endDate,
            modulesDropdownFilter,
          },
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const createGanttChartData = async (params) => {
    try {
      let response = await axios.post(`/api/gantt_chart`, params);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getModuleDropdownDataService = async ({
    organization_id,
    clientId,
    projectId,
  }) => {
    try {
      let response = await axios.get(
        `/api/module_list/dropdown/${organization_id}/${clientId}/${projectId}`
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const getUserDropdownDataService = async ({
    organization_id,
    clientId,
    projectId,
  }) => {
    try {
      let response = await axios.get(
        `/api/gantt_chart/user_dropdown/${organization_id}/${clientId}/${projectId}`
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getGanttChartData = async ({
    organization_id,
    clientId,
    projectId,
    startDate,
    endDate,
  }) => {
    try {
      let response = await axios.get(
        `/api/gantt_chart/${organization_id}/${clientId}/${projectId}`,
        { params: { startDate, endDate } }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const getDeparmentsWithUsers = async ({ organization_id }) => {
    try {
      let response = await axios.get(
        `/api/gantt_chart/departments_users/${organization_id}`
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const updateGanttChartData = async (id, params) => {
    try {
      let response = await axios.put(`/api/gantt_chart/${id}`, params);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  return {
    getGanttChartResources,
    createGanttChartData,
    getGanttChartData,
    updateGanttChartData,
    getModuleDropdownDataService,
    getUserDropdownDataService,
    getSummary,
    getDeparmentsWithUsers,
  };
};

export default GanttChartServices;
