import axios from "axios";

const API_PATH = "/api/auth";
const API_PATH_VERIFY_TOKEN = `${API_PATH}/verify_token`;
const API_PATH_LOGOUT = `${API_PATH}/logout`;

const LoginServices = () => {
  const verifyTokenService = async () => {
    try {
      let response = await axios.post(API_PATH_VERIFY_TOKEN);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const loginService = async (data) => {
    try {
      let response = await axios.post(API_PATH, data);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const logoutService = async (data) => {
    try {
      let response = await axios.post(API_PATH_LOGOUT);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  return { logoutService, loginService, verifyTokenService };
};

export default LoginServices;
