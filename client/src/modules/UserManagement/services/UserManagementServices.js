import axios from "axios";

const API_PATH = "/api/users";

const UserManagementServices = () => {
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
  const getUserTypesService = async (params) => {
    try {
      let organization_id = params.organization_id;

      delete params.organization_id;
      let response = await axios.get(
        `/api/user_types/user_type_dropdown/${organization_id}`,
        {
          params,
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getDepartmentService = async (params) => {
    try {
      let organization_id = params.organization_id;

      delete params.organization_id;
      let response = await axios.get(
        `/api/departments/department_dropdown/${organization_id}`,
        {
          params,
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const createUser = async ({ values, organization_id }, apiPath) => {
    try {
      let response = await axios.post(
        `${apiPath ? apiPath : API_PATH}/${organization_id}`,
        {
          ...values,
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const updateUserService = async ({ values, organization_id }) => {
    try {
      let response = await axios.put(
        `${API_PATH}/${organization_id}/${values.id}`,
        {
          ...values,
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  return {
    getUsersService,
    getUserTypesService,
    createUser,
    getDepartmentService,
    updateUserService,
  };
};

export default UserManagementServices;
