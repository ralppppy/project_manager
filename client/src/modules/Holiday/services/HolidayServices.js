import axios from "axios";

const API_PATH = "/api/holiday";
const API_PATH_HOLIDAY_TYPE = "/api/holiday_TYPE";

const HolidayServices = () => {
  const getHolidayTypeService = async (params) => {
    try {
      let organization_id = params.organization_id;

      delete params.organization_id;
      let response = await axios.get(
        `${API_PATH_HOLIDAY_TYPE}/holiday_type_dropdown/${organization_id}`,
        {
          params,
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const createHolidayService = async (params) => {
    let organization_id = params.organization_id;

    try {
      let response = await axios.post(`${API_PATH}/${organization_id}`, {
        params,
      });
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getHolidayService = async (params) => {
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

  return { getHolidayTypeService, createHolidayService, getHolidayService };
};

export default HolidayServices;
