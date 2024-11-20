import axios from "axios";

const API_PATH_VERIFY_TOKEN = "/api/auth/verify_set_password_token";
const SetPasswordServices = () => {
  const verifyTokenService = async (token) => {
    try {
      let response = await axios.post(
        API_PATH_VERIFY_TOKEN,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const setPassword = async (values, token) => {
    try {
      let response = await axios.post(`/api/auth/set_password`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const updatePassword = async (values, token) => {
    try {
      let response = await axios.post(`/api/auth/update_password`, values);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const setPasswordEmail = async (values) => {
    try {
      let response = await axios.post(`/api/auth/recover_account`, values);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  return { verifyTokenService, setPassword, setPasswordEmail, updatePassword };
};

export default SetPasswordServices;
