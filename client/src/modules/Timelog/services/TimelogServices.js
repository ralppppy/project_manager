import axios from "axios";

const API_PATH = "/api/timelog";

const TimelogServices = () => {
  const deleteTimelog = async (params) => {
    let { timelog_id, organization_id } = params;
    try {
      let response = await axios.delete(
        `${API_PATH}/delete_timelog/${organization_id}/${timelog_id}`
      );

      return [response.data, null];
    } catch (error) {
      console.log("deleteTimelog", error);
      return [null, error];
    }
  };

  const getTimelogEvents = async (params) => {
    let { organization_id } = params;
    try {
      let response = await axios.get(
        `${API_PATH}/timelog_events/${organization_id}`,
        {
          params,
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const createTimelogData = async (params) => {
    try {
      let response = await axios.post(
        `${API_PATH}/${params.organization_id}`,
        params
      );

      return [response.data, null];
    } catch (error) {
      console.log("createTimelogData", error);
      return [null, error];
    }
  };

  const updateTimelogData = async (id, params) => {
    try {
      let response = await axios.put(`${API_PATH}/${id}`, params);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getTimelogResources = async (params) => {
    let { organization_id } = params;
    try {
      let response = await axios.get(
        `${API_PATH}/timelog_resources/${organization_id}`,
        {
          params,
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const getUserTimelogTreeService = async (params) => {
    try {
      let { organization_id, user_id } = params;

      delete params.organization_id;
      delete params.user_id;

      let response = await axios.get(
        `${API_PATH}/${organization_id}/${user_id}`,
        {
          params,
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const getUserFilterTimelogTreeService = async (params) => {
    try {
      let { organization_id, user_id } = params;

      delete params.organization_id;
      delete params.user_id;

      let response = await axios.get(
        `${API_PATH}/filter/${organization_id}/${user_id}`,
        {
          params,
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getStatusFilterService = async (params) => {
    try {
      let { organization_id } = params;
      let response = await axios.get(
        `/api/tasks_status/tasks_status_dropdown/${organization_id}`,
        {
          params,
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getUserTaskService = async (params) => {
    try {
      let { organization_id, module_id, user_id } = params;
      let response = await axios.get(
        `${API_PATH}/task/${organization_id}/${module_id}/${user_id}`
      );
      return [response.data, null];
    } catch (error) {
      console.log(error);
      return [null, error];
    }
  };

  return {
    getUserFilterTimelogTreeService,
    getUserTimelogTreeService,
    getUserTaskService,
    getTimelogResources,
    getStatusFilterService,
    createTimelogData,
    deleteTimelog,
    getTimelogEvents,
    updateTimelogData,
  };
};

export default TimelogServices;
