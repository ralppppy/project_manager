import {
  setModalOpen,
  setSort,
  initialState,
  setUpdateState,
  setIsUpdate,
} from "../models/UserManagementModel";
import UserManagementServices from "../services/UserManagementServices";

const UserManagementController = ({
  dispatch,
  navigate,
  QUERY_KEY,
  messageApi,
  queryClient,
}) => {
  const {
    getUsersService,
    getUserTypesService,
    createUser,
    getDepartmentService,
    updateUserService,
  } = UserManagementServices();

  const handleGetUsers = async (organization_id, pagingation) => {
    let params = { organization_id, ...pagingation };
    let [{ data }, error] = await getUsersService(params);
    let users = data.data.map((user) => ({
      ...user,
      key: user.id,
    }));

    return { data: users, total: data.totalData };
  };
  const handleGetUserTypes = async (organization_id) => {
    let params = { organization_id };
    let [response, error] = await getUserTypesService(params);

    return response;
  };
  const handleGetDeparments = async (organization_id) => {
    let params = { organization_id };
    let [response, error] = await getDepartmentService(params);

    return response;
  };

  const onTableChange = (pagination, filters, sorter, extra) => {
    switch (extra.action) {
      case "paginate":
        let { current, pageSize } = pagination;
        const queryParams = new URLSearchParams({
          page: current,
          pageSize: pageSize,
        });

        navigate(`?${queryParams.toString()}`, { replace: true });

        break;
      case "sort":
        if (sorter.order) {
          dispatch(
            setSort({
              field: sorter.field,
              order: sorter.order,
            })
          );
        } else {
          dispatch(
            setSort({
              ...initialState.sort,
            })
          );
        }

        break;

      default:
        break;
    }
  };

  const handleModalOpen = (modalOpen) => {
    dispatch(setModalOpen(modalOpen));
  };

  const handleSubmit = async ({
    values,
    organization_id,
    isUpdate = false,
    isClient = false,
  }) => {
    let apiPath = isClient ? "/api/users/create_client" : null;
    if (isUpdate) {
      let [response, error] = await updateUserService(
        {
          values,
          organization_id,
        },
        apiPath
      );

      return [response, error, isUpdate];
    } else {
      let [response, error] = await createUser(
        { values, organization_id },
        apiPath
      );

      return [response, error, isUpdate];
    }
  };

  const handleChangeIsUpdateState = (isUpdate, project) => {
    // handleSetModalTitle(isUpdate);
    if (isUpdate) {
      delete project.employee.id;
      dispatch(
        setUpdateState({
          ...project,
          ...project.employee,
        })
      );
    }

    dispatch(setIsUpdate(isUpdate));
  };
  return {
    handleGetUsers,
    onTableChange,
    handleModalOpen,
    handleGetUserTypes,
    handleSubmit,
    handleGetDeparments,
    handleChangeIsUpdateState,
  };
};

export default UserManagementController;
