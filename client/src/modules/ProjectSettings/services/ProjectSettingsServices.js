import axios from "axios";

const ProjectSettingsServices = () => {
  const getSettings = async (apis, organization_id) => {
    try {
      let response = await axios.get(`${apis.get}/${organization_id}`);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const createSettingData = async (apis, organization_id, values) => {
    try {
      let response = await axios.post(`${apis.post}/${organization_id}`, {
        values,
      });
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const updateUserTypeAccessMenu = async ({ organization_id, values }) => {
    try {
      let response = await axios.post(
        `/api/user_type_menu_access/${organization_id}`,
        values
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const removeUserTypeAccessMenu = async ({
    organization_id,
    user_type_id,
    menu_key_code,
  }) => {
    try {
      let response = await axios.delete(
        `/api/user_type_menu_access/${organization_id}/${user_type_id}/${menu_key_code}`
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const updateLockUserTypeAccessMenu = async ({
    organization_id,
    user_type_id,
    menu_key_code,
    values,
  }) => {
    try {
      let response = await axios.put(
        `/api/user_type_menu_access/${organization_id}/${user_type_id}/${menu_key_code}`,
        values
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const updateSettingData = async (apis, organization_id, values) => {
    try {
      let response = await axios.put(`${apis.put}/${organization_id}`, {
        values,
      });
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const updateSort = async (apis, organization_id, data) => {
    try {
      let response = await axios.put(`${apis.updateSort}/${organization_id}`, {
        data,
      });
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const deleteSettingData = async (apis, organization_id, data) => {
    try {
      let response = await axios.delete(
        `${apis.delete}/${organization_id}/${data.id}`,
        {
          data,
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const setCompletionStatus = async ({ organization_id, status_id }) => {
    try {
      let response = await axios.post(
        `/api/task_completion_setting/${organization_id}`,
        {
          status_id,
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getCompletionStatus = async ({ organization_id }) => {
    try {
      let response = await axios.get(
        `/api/task_completion_setting/${organization_id}`
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  return {
    getSettings,
    createSettingData,
    updateSettingData,
    updateSort,
    deleteSettingData,
    setCompletionStatus,
    getCompletionStatus,
    updateUserTypeAccessMenu,
    removeUserTypeAccessMenu,
    updateLockUserTypeAccessMenu,
  };
};

export default ProjectSettingsServices;
