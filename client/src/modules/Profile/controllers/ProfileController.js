import {
  setCardHeight,
  setProfileInfoModal,
} from "@modules/Profile/models/ProfileModel";
import { setPrimaryColor, setTempColor } from "@state/Global";
import UserManagementServices from "../../UserManagement/services/UserManagementServices";
import { setUser } from "../../Guest/models/LoginModel";

const ProfileController = ({ dispatch }) => {
  const { updateUserService } = UserManagementServices();

  const handleSetHeight = (cardHeight) => {
    dispatch(setCardHeight(cardHeight));
  };

  const handleChangePrimaryThemeColor = (primaryColor) => {
    dispatch(setPrimaryColor(primaryColor));
  };
  const handleChangePrimaryTempThemeColor = (primaryColor) => {
    dispatch(setTempColor(primaryColor));
  };

  const handleOpenProfileModalOpen = (modalOpen) => {
    dispatch(setProfileInfoModal(modalOpen));
  };

  const handleSubmit = async ({ values, organization_id, prevData }) => {
    let [response, error] = await updateUserService({
      values,
      organization_id,
    });

    if (!error) {
      let userType = prevData.is_employee ? "employee" : "client";

      let { street_nr, zip_code, city, country } = values;
      let newData = {
        ...prevData,
        ...values,
        [userType]: { street_nr, zip_code, city, country },
      };

      dispatch(setUser(newData));
      handleOpenProfileModalOpen(false);
    }
  };

  return {
    handleSetHeight,
    handleChangePrimaryThemeColor,
    handleChangePrimaryTempThemeColor,
    handleOpenProfileModalOpen,
    handleSubmit,
  };
};

export default ProfileController;
