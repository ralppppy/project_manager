import { LoginServices } from "../services";
import { setUser } from "@modules/Guest/models/LoginModel";
import { Routes } from "@common";

const LoginController = ({ navigate, dispatch }) => {
  const { logoutService, loginService, verifyTokenService } = LoginServices();

  const verifyToken = async () => {
    let [data, error] = await verifyTokenService();
    if (!error) {
      dispatch(setUser(data.data));
    }
    return [data, error];
  };

  const handleLogin = async (data) => {
    let [response, error] = await loginService(data);
    if (!error) {
      return navigate(Routes.dashboard);
    }
  };

  const handleLogout = async () => {
    let [response, error] = await logoutService();
    if (!error) {
      return navigate(Routes.login);
    }
  };

  return {
    handleLogout,
    handleLogin,
    verifyToken,
  };
};

export default LoginController;
