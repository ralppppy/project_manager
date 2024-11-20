import { setModalOpen } from "../models/HolidayModel";
import { HolidayServices } from "../services";

const { getHolidayTypeService, createHolidayService, getHolidayService } =
  HolidayServices();

const HolidayController = ({
  dispatch,
  navigate,
  isUpdate,
  organization_id,
  queryClient,
}) => {
  const onChangeList = (page, pageSize, search) => {
    const queryParams = new URLSearchParams({
      page,
      pageSize,
    });
    navigate(`?${queryParams.toString()}`, { replace: true });
  };

  const handleGetHolidays = async (organization_id, pagingation) => {
    let params = { organization_id, ...pagingation };
    let [{ data }, error] = await getHolidayService(params);

    return data;
  };

  const handleSubmit = async (values) => {
    if (isUpdate) {
      console.log(isUpdate, values, "UPDATE FUNCTION HERE");
    } else {
      let data = {
        ...values,
        organization_id: organization_id,
      };

      let [holiday, error] = await createHolidayService(data);

      if (error) return { success: false, error };
      return { success: true, values: holiday };
    }
  };

  const handleGetHolidayTypeDropdown = async (organization_id) => {
    let params = { organization_id };
    let [{ data }, error] = await getHolidayTypeService(params);
    let holidayType = data.map((types) => ({
      ...types,
      key: types.id,
    }));

    return holidayType;
  };

  const handleModalOpen = (modalOpen) => {
    dispatch(setModalOpen(modalOpen));
  };

  return {
    handleGetHolidayTypeDropdown,
    handleGetHolidays,
    handleModalOpen,
    handleSubmit,
    onChangeList,
  };
};

export default HolidayController;
