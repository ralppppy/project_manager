import axios from "axios";

const ExactPlaceTablesServices = (API_PATH) => {
  const createService = async (data) => {
    try {
      let response = await axios.post(API_PATH, data);

      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const getService = async (params) => {
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
  const updateService = async (params) => {
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

  return { createService, getService, updateService };
};

export default ExactPlaceTablesServices;
