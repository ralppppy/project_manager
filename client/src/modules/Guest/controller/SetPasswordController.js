import { redirect } from "react-router-dom";
import { SetPasswordServices } from "../services";
import zxcvbn from "zxcvbn";
import { Routes } from "../../../common";

const SetPasswordController = ({
  setStrength,
  token,
  navigate,
  setIsSettingPassword,
  setIsSendingEmail,
  setDoneSending,
  form,
  messageApi,
  setUpdatingPassword,
  setResetPassword,
}) => {
  const { verifyTokenService, setPassword, setPasswordEmail, updatePassword } =
    SetPasswordServices();

  const handleVerifyToken = async (token) => {
    let [response, error] = await verifyTokenService(token);

    return error ? false : response;
  };

  const handleValidatePassword = async (rule, value) => {
    if (value) {
      // Check if the password is at least 8 characters long.
      if (value.length < 8) {
        throw new Error("Password must be at least 8 characters long.");
      }

      // Check if the password contains at least one uppercase letter.
      if (!/[A-Z]/.test(value)) {
        throw new Error("Password must contain at least one uppercase letter.");
      }

      // Check if the password contains at least one lowercase letter.
      if (!/[a-z]/.test(value)) {
        throw new Error("Password must contain at least one lowercase letter.");
      }

      // Check if the password contains at least one digit.
      if (!/\d/.test(value)) {
        throw new Error("Password must contain at least one digit.");
      }

      // Check if the password contains at least one special character.
      // Check if the password contains at least one special character.
      if (!/[@$!%*?&^()_+{}\[\]:;,~`\-|\\./=]/.test(value)) {
        throw new Error(
          "Password must contain at least one special character."
        );
      }
    }
  };

  const handlePasswordChange = (password) => {
    const result = zxcvbn(password);
    setStrength(result.score); // zxcvbn returns a score from 0 to 4
  };

  const handleGetProgressColor = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return "exception"; // Red for weak passwords
      case 2:
      case 3:
        return "active"; // Yellow for moderate passwords
      case 4:
        return "success"; // Green for strong passwords
      default:
        return "normal"; // Default color
    }
  };

  const handleGetProgressSteps = (strength) => {
    switch (strength) {
      case 0:
        return 0;
      case 1:
        return 25;
      case 2:
        return 50;
      case 3:
        return 75;
      case 4:
        return 100;
      default:
        return 0;
    }
  };

  const handleSetPassword = async (values) => {
    setIsSettingPassword(true);
    let [response, error] = await setPassword(values, token);

    if (!error) {
      setIsSettingPassword(false);

      navigate(Routes.login);
      messageApi.open({
        type: "success",
        content: "Succesfully set a password!",
      });
    }
  };

  const handleSetPasswordEmail = async (values) => {
    setIsSendingEmail(true);
    let [response, error] = await setPasswordEmail(values);
    setIsSendingEmail(false);
    setDoneSending(true);
    form.resetFields();
  };

  const handleForgotPasswordEmail = async (email) => {
    setResetPassword(true);
    let [response, error] = await setPasswordEmail({ email });

    if (!error) {
      messageApi.open({
        type: "success",
        content: "We've send you and email to update your password!",
      });
    }

    setResetPassword(false);
  };

  const handleUpdatePassword = async (values) => {
    setUpdatingPassword(true);
    let [response, error] = await updatePassword(values);

    if (error) {
      let errorMessage = error.response.data.message;
      messageApi.open({
        type: "error",
        content: errorMessage,
      });
    } else {
      messageApi.open({
        type: "success",
        content: "Your password has now been updated!",
      });
      form.resetFields();
      setStrength(null);
    }
    setUpdatingPassword(false);
  };

  return {
    handleVerifyToken,
    handlePasswordChange,
    handleGetProgressColor,
    handleGetProgressSteps,
    handleValidatePassword,
    handleSetPassword,
    handleSetPasswordEmail,
    handleUpdatePassword,
    handleForgotPasswordEmail,
  };
};

export default SetPasswordController;
