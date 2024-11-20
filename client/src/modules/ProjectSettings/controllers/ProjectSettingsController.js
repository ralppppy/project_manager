import { ProjectSettingsServices } from "../services";

const ProjectSettingsController = ({ messageApi }) => {
  const {
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
  } = ProjectSettingsServices({});

  const handleGetSettings = async (apis, organization_id) => {
    let [response, error] = await getSettings(apis, organization_id);
    return response;
  };

  const getContrastTextColor = (backgroundColor, colorText) => {
    if (!backgroundColor) return colorText;

    // Helper function to calculate the relative luminance of a color
    function getRelativeLuminance(color) {
      const [r, g, b] = color.map((value) => {
        value /= 255;
        return value <= 0.03928
          ? value / 12.92
          : Math.pow((value + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    // Split the background color into RGB components
    const match = backgroundColor.match(
      /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
    );
    const backgroundRgb = match
      ? [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)]
      : [0, 0, 0]; // Default to black

    // Calculate the background's relative luminance
    const backgroundLuminance = getRelativeLuminance(backgroundRgb);

    // Define a threshold for deciding text color (you can adjust this)
    const threshold = 0.5; // You can adjust this threshold as needed

    // Choose the text color based on luminance contrast
    return backgroundLuminance > threshold ? "black" : "white";
  };

  const handleAddNewSettingData = async ({ values, organization_id, apis }) => {
    let [response, error] = await createSettingData(
      apis,
      organization_id,
      values
    );

    return response;
  };
  const handleUpdateNewSettingData = async ({
    apis,
    organization_id,
    item,
    content,
  }) => {
    let values = {
      id: item.id,
      [content.key]: content.value,
    };

    let [response, error] = await updateSettingData(
      apis,
      organization_id,
      values
    );

    return { response, values };
  };

  const handleUpdateSorting = async ({ data, apis, organization_id }) => {
    let [response, error] = await updateSort(apis, organization_id, data);

    return response;
  };

  const handleDeleteSettingData = async ({ data, apis, organization_id }) => {
    let [response, error] = await deleteSettingData(
      apis,
      organization_id,
      data
    );

    if (error?.response.status === 409) {
      return { response: false, data };
    } else {
      return { response, data };
    }
  };

  const handleSetCompletionStatus = async ({ organization_id, status_id }) => {
    let [response, error] = await setCompletionStatus({
      organization_id,
      status_id,
    });

    return status_id;
  };

  const handleGetCompletionStatus = async ({ organization_id }) => {
    let [response, error] = await getCompletionStatus({ organization_id });

    return response;
  };

  const handleUpdateUserTypeAuth = async ({
    organization_id,
    info,
    setUserTypeList,
    setCurrentDragging,
  }) => {
    if (!info.destination) {
      setCurrentDragging({});
      return;
    }

    let inserUserTypeAuthSettings = [];

    setUserTypeList((prevData) => {
      let userTypeId = info.destination.droppableId.split("_")[3];
      let userTypeIdSource = info.source.droppableId.split("_")[3];
      let inserIndex = info.destination.index;
      let inserSourceIndex = info.source.index;
      let draggableId = info.draggableId.split("-");
      draggableId = draggableId.length > 1 ? draggableId[1] : draggableId[0];

      let newPrevData = prevData;

      newPrevData = newPrevData.map((c) => {
        if (c.id === parseInt(userTypeId)) {
          let newMenuAccessValue = {
            menu_key_code: draggableId,
            user_type_id: userTypeId,
            sort: inserIndex,
            key: draggableId,
            organization_id,
            is_lock: false,
          };

          let newMenuAccess = [...c.menu_access];

          let hasDuplicate = newMenuAccess.find(
            (c) => c.menu_key_code === newMenuAccessValue.menu_key_code
          );

          let [removed] = newMenuAccess.splice(inserSourceIndex, 1);

          if (parseInt(userTypeIdSource) === parseInt(userTypeId)) {
            newMenuAccess.splice(inserIndex, 0, removed);
          } else {
            if (hasDuplicate) {
              messageApi.open({
                type: "warning",
                content: "This menu is already been assiged to this user type",
              });

              return c;
            } else {
              newMenuAccess.splice(inserIndex, 0, newMenuAccessValue);
            }
          }

          newMenuAccess = newMenuAccess.map((c, sort) => {
            return { ...c, sort };
          });

          inserUserTypeAuthSettings = newMenuAccess;

          return { ...c, menu_access: newMenuAccess };
        }

        return c;
      });

      return newPrevData;
    });

    let [response, error] = await updateUserTypeAccessMenu({
      organization_id,
      values: inserUserTypeAuthSettings,
    });

    setCurrentDragging({});
  };

  const handleRemoveUserTypeList = async ({
    item,
    menuItem,
    setUserTypeList,
    organization_id,
  }) => {
    let [response, error] = await removeUserTypeAccessMenu({
      organization_id,
      user_type_id: item.id,
      menu_key_code: menuItem.menu_key_code,
    });

    if (!error) {
      setUserTypeList((prev) => {
        let newUserTypeList = prev.map((userType) => {
          if (userType.id === item.id) {
            let newMenuAccess = userType.menu_access.filter(
              (c) => c.menu_key_code !== menuItem.menu_key_code
            );

            return { ...userType, menu_access: newMenuAccess };
          }

          return userType;
        });

        return newUserTypeList;
      });
    }
  };

  const handlUpdateLockUserTypeList = async ({
    item,
    menuItem,
    setUserTypeList,
    organization_id,
    values,
  }) => {
    let [response, error] = await updateLockUserTypeAccessMenu({
      organization_id,
      menu_key_code: menuItem.menu_key_code,
      user_type_id: item.id,
      values,
    });

    if (!error) {
      setUserTypeList((prev) => {
        let newUserTypeList = prev.map((userType) => {
          if (userType.id === item.id) {
            let newMenuAccess = userType.menu_access.map((c) => {
              if (c.menu_key_code === menuItem.menu_key_code) {
                return { ...c, ...values };
              }

              return c;
            });

            return { ...userType, menu_access: newMenuAccess };
          }

          return userType;
        });

        return newUserTypeList;
      });
    }
  };

  return {
    handleGetSettings,
    getContrastTextColor,
    handleAddNewSettingData,
    handleUpdateNewSettingData,
    handleUpdateSorting,
    handleDeleteSettingData,
    handleSetCompletionStatus,
    handleGetCompletionStatus,
    handleUpdateUserTypeAuth,
    handleRemoveUserTypeList,
    handlUpdateLockUserTypeList,
  };
};

export default ProjectSettingsController;
