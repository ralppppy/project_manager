import { Button, Input, Space, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { setModalOpen, setPage, setSort } from "../models/ExactPlaceTableModel";
import { initialState } from "../models/ExactPlaceTableModel";
import { ExactPlaceTablesServices } from "../services";

const ExactPlacetableController = ({
  dispatch,
  user,
  queryClient,
  QUERY_KEY,
  navigate,
  apiPath,
  messageApi,
  onAfterSubmit,
}) => {
  const { createService, getService, updateService } =
    ExactPlaceTablesServices(apiPath);

  const handleModalOpen = (modalOpen) => {
    dispatch(setModalOpen(modalOpen));
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

  const handleGetData = async (user, pagingation) => {
    let params = { organization_id: user.organization_id, ...pagingation };
    let [{ data }, error] = await getService(params);

    let clients = data.data.map((client) => ({
      ...client,
      key: client.id,
    }));
    return { data: clients, total: data.totalData };
  };

  const handleSubmit = async (values) => {
    let data = {
      ...values,
      organization_id: user.organization_id,
      status: 1, //Always active at first
    };

    let [client, error] = await createService(data);
    if (error) return { success: false, error };
    return { success: true, values: client };
  };

  const handleUpdate = async (values) => {
    let [client, error] = await updateService(values);
    if (error) return { success: false, error };
    return { success: true, values };
  };

  const handleUpdateStateOnSuccess = (newData) => {
    if (!newData.success) {
      let message = newData.error.response.data.message;
      messageApi.open({
        type: "error",
        content: message,
      });

      return;
    }

    queryClient.setQueryData(QUERY_KEY, (prevData) => {
      let updatedData = prevData.data.map((c) => {
        if (c.id === newData.values.id) {
          return { ...c, ...newData.values };
        }

        return c;
      });
      return {
        ...prevData,
        data: updatedData,
      };
    });
  };

  const isQueryKeyExist = (query, queryClient) => {
    const queryCache = queryClient.getQueryCache();
    const queryKey2 = queryCache.getAll().map((cache) => cache.queryKey);
    const queryKey = queryCache
      .getAll()
      .map((cache) => cache.queryKey)
      .find((queryKey) => JSON.stringify(queryKey) === JSON.stringify(query)); // QueryKey[]

    return queryKey;
  };

  const getAllQuery = (queryClient, getQueryType = null) => {
    const queryCache = queryClient.getQueryCache();

    if (getQueryType) {
      return queryCache
        .getAll()
        .map((cache) => cache.queryKey)
        .filter((c) => c[0] === getQueryType);
    }

    return queryCache.getAll().map((cache) => cache.queryKey);
  };

  const handleSuccess = (newData) => {
    if (!newData.success) {
      let message = newData.error.response.data.message;
      messageApi.open({
        type: "error",
        content: message,
      });

      return;
    }

    let allQuery = getAllQuery(queryClient, QUERY_KEY[0]);

    allQuery.forEach((query) => {
      queryClient.invalidateQueries(query);
    });
    handleModalOpen(false);

    //Run onAfterSubmit when available
    if (onAfterSubmit) {
      onAfterSubmit();
    }
  };

  return {
    handleModalOpen,
    handleSubmit,
    handleGetData,
    onTableChange,
    handleSuccess,
    handleUpdate,
    handleUpdateStateOnSuccess,
  };
};

export default ExactPlacetableController;
