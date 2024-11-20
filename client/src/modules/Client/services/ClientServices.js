import axios from "axios";

const API_PATH = "/api/clients";

const ClientServices = () => {
  const createClientService = async (data) => {
    try {
      let response = await axios.post(API_PATH, data);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const getClientsService = async (params, apiPath = "") => {
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
  const getClientsDropdownService = async (params, apiPath = "") => {
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

  const getUsersService = async (params, apiPath = "") => {
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

  const getClientsWithProjectsFilter = async (organization_id, showTask) => {
    try {
      let response = await axios.get(
        `${API_PATH}/filter_client_project/${organization_id}`,
        { params: { showTask } }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getClientUsersService = async ({ organization_id, record }) => {
    try {
      let clientId = record.id;

      let response = await axios.get(
        `/api/users/client/${organization_id}/${clientId}`
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  return {
    createClientService,
    getClientsService,
    updateClientsService,
    getUsersService,
    getClientsDropdownService,
    getClientsWithProjectsFilter,
    getClientUsersService,
  };
};

export default ClientServices;
